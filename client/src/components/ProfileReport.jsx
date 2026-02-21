import React, { useRef } from 'react';
import { Download, FileText } from 'lucide-react';

const COLORS = ['#00ff41', '#00f3ff', '#ff00ff', '#fcee0a', '#bc13fe', '#ff3131'];

const ProfileReport = ({ data }) => {
  const reportRef = useRef(null);

  const handleDownload = () => {
    // Create a printable HTML report
    const commits = (data.commit_activity || []).reduce((s, w) => s + (w.total || 0), 0);
    const langEntries = Object.entries(data.languages || {});
    const totalBytes = langEntries.reduce((s, [, v]) => s + v, 0);

    const primaryLang = langEntries.sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
    const healthScore = Math.min(100, Math.round(
      (Math.min(100, (data.commit_activity?.filter(w => w.total > 0).length / 52) * 100) * 0.25) +
      (Math.min(100, Math.log10((data.summary?.stars || 0) + 1) * 25) * 0.25) +
      (Math.min(100, Object.keys(data.languages || {}).length * 15) * 0.25) +
      (Math.min(100, (data.health?.closure_rate || 0) * 0.5) * 0.25)
    ));

    const reportHtml = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>GH_ANALYZER Report - ${data.summary?.name}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #050505; color: #fff; font-family: 'Courier New', monospace; padding: 40px; }
  h1 { font-size: 32px; color: #00ff41; text-transform: uppercase; letter-spacing: 4px; border-bottom: 1px solid #008F11; padding-bottom: 16px; margin-bottom: 24px; }
  .meta { font-size: 11px; color: #4b5563; margin-bottom: 32px; }
  .section { margin-bottom: 32px; }
  .section h2 { font-size: 12px; color: #00f3ff; text-transform: uppercase; letter-spacing: 3px; border-left: 3px solid #00ff41; padding-left: 10px; margin-bottom: 16px; }
  .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
  .stat { background: #0a0a0a; border: 1px solid #008F11; padding: 16px; text-align: center; }
  .stat .value { font-size: 28px; font-weight: bold; color: #00ff41; }
  .stat .label { font-size: 9px; color: #4b5563; text-transform: uppercase; letter-spacing: 2px; margin-top: 4px; }
  .lang-bar { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
  .lang-bar .name { width: 100px; font-size: 10px; color: #a3a3a3; text-transform: uppercase; }
  .lang-bar .bar-track { flex: 1; height: 6px; background: #0a0a0a; border: 1px solid #1f2937; }
  .lang-bar .bar-fill { height: 100%; }
  .lang-bar .pct { width: 40px; font-size: 10px; text-align: right; color: #a3a3a3; }
  .contributor { display: flex; align-items: center; gap: 12px; padding: 8px; border: 1px solid #1f2937; margin-bottom: 4px; }
  .contributor .rank { width: 24px; font-size: 14px; font-weight: bold; color: #00ff41; }
  .contributor .login { font-size: 12px; color: #fff; flex: 1; }
  .contributor .ops { font-size: 10px; color: #4b5563; }
  .health-row { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
  .health-label { width: 180px; font-size: 10px; color: #a3a3a3; text-transform: uppercase; letter-spacing: 1px; }
  .health-track { flex: 1; height: 6px; background: #0a0a0a; border: 1px solid #1f2937; }
  .health-fill { height: 100%; background: #00ff41; }
  .health-val { width: 40px; font-size: 10px; text-align: right; color: #00ff41; }
  .footer { border-top: 1px solid #008F11; padding-top: 16px; font-size: 9px; color: #1f2937; text-transform: uppercase; letter-spacing: 2px; display: flex; justify-content: space-between; }
  @media print { body { padding: 20px; } }
</style>
</head>
<body>
<h1>⬡ GH_ANALYZER :: Profile Report</h1>
<div class="meta">GENERATED: ${new Date().toUTCString()} // TARGET: ${data.summary?.owner?.login}/${data.summary?.name} // HEALTH_SCORE: ${healthScore}/100</div>

<div class="section">
  <h2>Repository Overview</h2>
  <div class="grid">
    <div class="stat"><div class="value">${(data.summary?.stars || 0).toLocaleString()}</div><div class="label">Stars</div></div>
    <div class="stat"><div class="value">${(data.summary?.forks || 0).toLocaleString()}</div><div class="label">Forks</div></div>
    <div class="stat"><div class="value">${(data.summary?.total_commits || 0).toLocaleString()}</div><div class="label">Total Commits</div></div>
    <div class="stat"><div class="value">${(data.contributors || []).length}</div><div class="label">Contributors</div></div>
  </div>
  <p style="font-size:12px; color:#a3a3a3; border-left:2px solid #008F11; padding-left:12px;">${data.summary?.description || 'No description provided.'}</p>
</div>

<div class="section">
  <h2>Activity (Last 12 Months)</h2>
  <div class="grid" style="grid-template-columns: repeat(3,1fr);">
    <div class="stat"><div class="value">${commits}</div><div class="label">Annual Commits</div></div>
    <div class="stat"><div class="value">${(data.commit_activity || []).filter(w => w.total > 0).length}</div><div class="label">Active Weeks</div></div>
    <div class="stat"><div class="value">${(data.health?.commit_frequency_weekly || 0).toFixed(1)}</div><div class="label">Avg/Week</div></div>
  </div>
</div>

<div class="section">
  <h2>Language Distribution</h2>
  ${langEntries.sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name, bytes], i) => `
    <div class="lang-bar">
      <div class="name">${name}</div>
      <div class="bar-track"><div class="bar-fill" style="width:${Math.round((bytes / totalBytes) * 100)}%; background:${COLORS[i % COLORS.length]};"></div></div>
      <div class="pct">${Math.round((bytes / totalBytes) * 100)}%</div>
    </div>
  `).join('')}
</div>

<div class="section">
  <h2>Health Metrics</h2>
  ${[
        { label: 'Issue Closure Rate', value: Math.round(data.health?.closure_rate || 0) },
        { label: 'Commit Consistency', value: Math.min(100, Math.round(((data.commit_activity || []).filter(w => w.total > 0).length / 52) * 100)) },
        { label: 'Tech Diversity', value: Math.min(100, Object.keys(data.languages || {}).length * 15) },
        { label: 'Overall Health', value: healthScore },
      ].map(m => `
    <div class="health-row">
      <div class="health-label">${m.label}</div>
      <div class="health-track"><div class="health-fill" style="width:${m.value}%;"></div></div>
      <div class="health-val">${m.value}%</div>
    </div>
  `).join('')}
</div>

<div class="section">
  <h2>Top Contributors</h2>
  ${(data.contributors || []).slice(0, 5).map((c, i) => `
    <div class="contributor">
      <div class="rank">#${i + 1}</div>
      <div class="login">${c.login}</div>
      <div class="ops">${c.contributions.toLocaleString()} commits</div>
    </div>
  `).join('')}
</div>

<div class="footer">
  <span>GH_ANALYZER v2.1.0 // REPORT_ID: ${Math.random().toString(36).substring(2, 9).toUpperCase()}</span>
  <span>PRIMARY_LANG: ${primaryLang} // BUS_FACTOR: ${data.health?.calculated_bus_factor}</span>
</div>
</body>
</html>`;

    const blob = new Blob([reportHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gh-analyzer-report-${data.summary?.name || 'repo'}-${Date.now()}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="glass-card !p-0 overflow-hidden border-neon-dim/20 bg-black-800/80">
      {/* Header */}
      <div className="p-4 border-b border-neon-dim/20 bg-neon-dim/5 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-neon-bright" />
          <h3 className="text-neon-bright font-bold text-xs uppercase tracking-[0.2em]">Downloadable Profile Report</h3>
        </div>
        <span className="text-[10px] text-neon-dim font-mono">PDF_EXPORT</span>
      </div>

      <div className="p-6 space-y-6">
        {/* Preview */}
        <div className="border border-neon-dim/20 bg-black-900/50 p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-neon-dim/10 pb-3">
            <div>
              <h4 className="text-white font-bold text-sm">{data.summary?.name}</h4>
              <p className="text-gray-500 text-[10px] font-mono">{data.summary?.owner?.login}</p>
            </div>
            <img src={data.summary?.owner?.avatar_url} alt="" className="w-10 h-10 border border-neon-dim/40" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {[
              { label: 'Stars', value: data.summary?.stars?.toLocaleString() || 0 },
              { label: 'Forks', value: data.summary?.forks?.toLocaleString() || 0 },
              { label: 'Commits', value: data.summary?.total_commits?.toLocaleString() || 0 },
              { label: 'Contributors', value: (data.contributors?.length || 0) },
            ].map((s, i) => (
              <div key={i} className="text-center p-2 border border-neon-dim/10 bg-black-900">
                <div className="text-neon-bright text-lg font-bold">{s.value}</div>
                <div className="text-gray-500 text-[9px] uppercase tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>

          <p className="text-gray-400 text-[10px] font-mono border-l-2 border-neon-dim/30 pl-3 truncate">
            {data.summary?.description || 'No description provided.'}
          </p>

          <div className="text-[9px] text-gray-600 font-mono pt-2 border-t border-neon-dim/10 flex justify-between">
            <span>REPORT_READY // GH_ANALYZER_v2.1.0</span>
            <span>LANG: {data.summary?.language || 'N/A'}</span>
          </div>
        </div>

        {/* Info Boxes */}
        <div className="grid grid-cols-3 gap-3 text-[10px] font-mono">
          {[
            { label: 'Format', value: 'HTML/Print' },
            { label: 'Includes', value: '8 Sections' },
            { label: 'Purpose', value: 'Portfolio' },
          ].map((item, i) => (
            <div key={i} className="border border-neon-dim/20 p-2 text-center">
              <div className="text-neon-bright font-bold">{item.value}</div>
              <div className="text-gray-500 uppercase">{item.label}</div>
            </div>
          ))}
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          className="w-full py-3 bg-neon-dim/10 border border-neon-bright/50 text-neon-bright font-bold text-xs uppercase tracking-widest hover:bg-neon-bright hover:text-black transition-all duration-300 flex items-center justify-center gap-2 group"
        >
          <Download className="w-4 h-4 group-hover:animate-bounce" />
          Download Profile Report
        </button>
        <p className="text-[9px] text-gray-600 font-mono text-center">Opens as HTML — use browser Print → Save as PDF</p>
      </div>

      <div className="h-6 border-t border-neon-dim/10 bg-black-900/50 flex items-center justify-between px-4 text-[9px] text-gray-500 font-mono uppercase tracking-wider">
        <span>REPORT_ENGINE :: READY</span>
        <span>FORMAT: HTML → PDF</span>
      </div>
    </div>
  );
};

export default ProfileReport;
