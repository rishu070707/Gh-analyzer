const githubService = require('../services/githubService');

exports.analyzeRepo = async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ error: 'Repository URL is required' });
        }

        // Extract owner and repo from URL
        // Supports formats like: https://github.com/owner/repo or owner/repo
        let owner, repo;

        if (url.includes('github.com')) {
            const parts = url.split('github.com/');
            if (parts.length > 1) {
                const path = parts[1].split('/');
                owner = path[0];
                repo = path[1];
            }
        } else {
            const parts = url.split('/');
            if (parts.length === 2) {
                owner = parts[0];
                repo = parts[1];
            }
        }

        if (!owner || !repo) {
            return res.status(400).json({ error: 'Invalid repository URL format' });
        }

        // Clean up repo string (remove .git or query params)
        repo = repo.replace('.git', '').split('?')[0];

        console.log(`Analyzing repo: ${owner}/${repo}`);

        const token = req.headers['x-github-token'];
        const data = await githubService.fetchRepoData(owner, repo, token);

        res.json({
            success: true,
            data
        });

    } catch (error) {
        console.error('Error analyzing repo:', error.message);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to fetch repository data'
        });
    }
};
