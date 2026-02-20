const axios = require('axios');

const GITHUB_API_BASE = 'https://api.github.com';

const getHeaders = (token) => {
    const headers = {
        'Accept': 'application/vnd.github.v3+json',
    };
    const authToken = token || process.env.GITHUB_TOKEN;
    if (authToken) {
        headers['Authorization'] = `token ${authToken}`;
    }
    return headers;
};

// Helper: Fetch with retries or handling specific errors
const fetchGitHub = async (url, token) => {
    try {
        const response = await axios.get(url, { headers: getHeaders(token) });
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            throw new Error('Repository not found');
        }
        if (error.response && error.response.status === 403) {
            throw new Error('API rate limit exceeded. Please try again later or provide a token.');
        }
        throw error;
    }
};

// Helper: Fetch Stats with polling for 202 Accepted
const fetchGitHubStats = async (url, token) => {
    let retries = 8; // Increased retries
    while (retries > 0) {
        try {
            const response = await axios.get(url, { headers: getHeaders(token) });
            if (response.status === 200) {
                return response.data;
            } else if (response.status === 202) {
                // Statistics are being computed, wait 2s and retry
                await new Promise(resolve => setTimeout(resolve, 2000));
                retries--;
                continue;
            }
        } catch (error) {
            console.warn(`Failed to fetch stats from ${url}:`, error.message);
            return [];
        }
    }
    return []; // Return empty if timed out
};

const fetchRepoData = async (owner, repo, token) => {
    const baseData = await fetchGitHub(`${GITHUB_API_BASE}/repos/${owner}/${repo}`, token);

    // Parallel execution for other endpoints
    const [languages, contributors, commitActivity, issuesClosed, issuesOpen, participation, punchCard] = await Promise.all([
        fetchGitHub(`${GITHUB_API_BASE}/repos/${owner}/${repo}/languages`, token),
        fetchGitHub(`${GITHUB_API_BASE}/repos/${owner}/${repo}/contributors?per_page=100`, token),
        fetchGitHubStats(`${GITHUB_API_BASE}/repos/${owner}/${repo}/stats/commit_activity`, token), // Weekly commit count for last year
        // For issue closure rate. Note: standard endpoint returns mixed PRs and issues. Use search API for accuracy or just accept approximation.
        // Search API has separate rate limits, safer.
        axios.get(`${GITHUB_API_BASE}/search/issues?q=repo:${owner}/${repo}+type:issue+state:closed`, { headers: getHeaders(token) }).then(res => res.data.total_count),
        axios.get(`${GITHUB_API_BASE}/search/issues?q=repo:${owner}/${repo}+type:issue+state:open`, { headers: getHeaders(token) }).then(res => res.data.total_count),
        // Participation stats (weekly commit counts for owner and others)
        fetchGitHubStats(`${GITHUB_API_BASE}/repos/${owner}/${repo}/stats/participation`, token),
        // Punch Card (hourly commit counts by day)
        fetchGitHubStats(`${GITHUB_API_BASE}/repos/${owner}/${repo}/stats/punch_card`, token),
    ]);

    // Calculate Total Commits (approx from participation or fetch last page header)
    // Using participation is faster but only last year.
    // For total commits since beginning, we need to traverse or use header trick.
    // We'll use the header trick separately.
    let totalCommits = 0;
    try {
        const commitsRes = await axios.get(`${GITHUB_API_BASE}/repos/${owner}/${repo}/commits?per_page=1`, { headers: getHeaders(token) });
        // Parse Link header for last page
        const linkHeader = commitsRes.headers.link;
        if (linkHeader) {
            const match = linkHeader.match(/page=(\d+)>; rel="last"/);
            if (match) {
                totalCommits = parseInt(match[1], 10);
            } else {
                totalCommits = 1; // if only 1 page
            }
        } else {
            totalCommits = commitsRes.data.length; // Likely small number
        }
    } catch (e) {
        console.warn("Could not fetch total commits via header", e.message);
        // Fallback?
    }

    // Calculate Health Metrics
    // Bus factor: if top 5 contributors have > 50% of commits?
    const totalContributions = contributors.reduce((acc, c) => acc + c.contributions, 0);
    const top5Contributions = contributors.slice(0, 5).reduce((acc, c) => acc + c.contributions, 0);
    const busFactor = totalContributions > 0 ? (top5Contributions / totalContributions) : 0;

    // Issue Closure Rate
    const totalIssues = issuesClosed + issuesOpen;
    const closureRate = totalIssues > 0 ? (issuesClosed / totalIssues) * 100 : 0;

    // Commit Frequency (avg per week over last year)
    // commitActivity is array of { total, week, days }
    const totalCommitsLastYear = Array.isArray(commitActivity) ? commitActivity.reduce((acc, w) => acc + w.total, 0) : 0;
    const avgCommitsPerWeek = totalCommitsLastYear / 52;

    return {
        summary: {
            name: baseData.name,
            description: baseData.description,
            stars: baseData.stargazers_count,
            forks: baseData.forks_count,
            open_issues: baseData.open_issues_count,
            watchers: baseData.watchers_count,
            owner: {
                login: baseData.owner.login,
                avatar_url: baseData.owner.avatar_url,
                html_url: baseData.owner.html_url
            },
            created_at: baseData.created_at,
            updated_at: baseData.updated_at,
            language: baseData.language,
            total_commits: totalCommits,
            total_issues_closed: issuesClosed,
            total_issues_open: issuesOpen,
        },
        languages,
        contributors: contributors.map(c => ({
            login: c.login,
            avatar_url: c.avatar_url,
            contributions: c.contributions,
            html_url: c.html_url
        })),
        commit_activity: Array.isArray(commitActivity) ? commitActivity : [], // Array of weekly stats
        health: {
            bus_factor: busFactor, // 0 to 1
            calculated_bus_factor: calculateBusFactorNumber(contributors, totalContributions),
            closure_rate: closureRate,
            commit_frequency_weekly: avgCommitsPerWeek
        },
        participation, // owner vs others
        punch_card: Array.isArray(punchCard) ? punchCard : [] // [day, hour, count]
    };
};

function calculateBusFactorNumber(contributors, total) {
    if (total === 0) return 0;
    let runningSum = 0;
    let count = 0;
    for (const c of contributors) {
        runningSum += c.contributions;
        count++;
        if (runningSum >= total * 0.5) {
            return count;
        }
    }
    return count;
}

module.exports = {
    fetchRepoData
};
