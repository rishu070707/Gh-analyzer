import React, { useState, useEffect } from 'react';
import { Github, Users, GitCommit, AlertCircle, Activity, Star, GitFork, Target, Shield, TrendingUp, Code, GraduationCap, Database, Bookmark, GitCompare, BarChart2 } from 'lucide-react';
import SearchBar from './components/SearchBar';
import StatCard from './components/StatCard';
import ChartGrid from './components/ChartGrid';
import RepoPersona from './components/RepoPersona';
import HypeMeter from './components/HypeMeter';
import Leaderboard from './components/Leaderboard';
import GlitchText from './components/GlitchText';
import Typewriter from './components/Typewriter';
import TokenModal from './components/TokenModal';
import TerminalLog from './components/TerminalLog';
import HealthScore from './components/HealthScore';
import ActivityTrends from './components/ActivityTrends';
import ProfileComparison from './components/ProfileComparison';
import ProfileReport from './components/ProfileReport';
import SavedProfiles from './components/SavedProfiles';
import SkillStack from './components/SkillStack';
import PlacementScore from './components/PlacementScore';
import RepoInsights from './components/RepoInsights';
import GrowthBenchmarks from './components/GrowthBenchmarks';
import { analyzeRepo } from './services/api';

const TABS = [
  { id: 'overview', label: 'Overview', shortLabel: 'Home', icon: <Activity className="w-4 h-4" /> },
  { id: 'analytics', label: 'Analytics', shortLabel: 'Stats', icon: <BarChart2 className="w-4 h-4" /> },
  { id: 'advanced', label: 'Advanced', shortLabel: 'Insights', icon: <Database className="w-4 h-4" /> },
  { id: 'compare', label: 'Compare', shortLabel: 'Compare', icon: <GitCompare className="w-4 h-4" /> },
  { id: 'placement', label: 'Placement', shortLabel: 'Score', icon: <GraduationCap className="w-4 h-4" /> },
  { id: 'saved', label: 'Saved', shortLabel: 'Saved', icon: <Bookmark className="w-4 h-4" /> },
];

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTypewriter, setShowTypewriter] = useState(true);
  const [tokenModalOpen, setTokenModalOpen] = useState(false);
  const [pendingUrl, setPendingUrl] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [lastUrl, setLastUrl] = useState('');

  useEffect(() => {
    if (loading) {
      setShowTypewriter(false);
      setTimeout(() => setShowTypewriter(true), 100);
    }
  }, [loading]);

  const handleSearch = async (url, token = null) => {
    setLoading(true);
    setError('');
    setData(null);
    setPendingUrl(url);
    setActiveTab('overview');
    try {
      const result = await analyzeRepo(url, token);
      setData(result.data);
      setLastUrl(url);
      setTokenModalOpen(false);
    } catch (err) {
      const msg = err.error || err.message || 'Failed to analyze repository.';
      setError(msg);
      if (msg.toLowerCase().includes('rate limit') || msg.toLowerCase().includes('token')) {
        setTokenModalOpen(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTokenSubmit = (token) => {
    if (pendingUrl && token) handleSearch(pendingUrl, token);
  };

  return (
    <div className="min-h-screen text-gray-300 font-mono selection:bg-neon-green/30 selection:text-white relative overflow-x-hidden">
      {/* ── Token Modal ── */}
      {tokenModalOpen && (
        <TokenModal onSubmit={handleTokenSubmit} onCancel={() => setTokenModalOpen(false)} error={error} />
      )}

      {/* ── Background Grid ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] animate-grid-scroll" />
        <div className="absolute inset-0 bg-black-900/90" />
      </div>

      {/* ── Main Content ── */}
      {/* Bottom padding on mobile so bottom-nav doesn't overlap content */}
      <div className="max-w-7xl mx-auto relative z-10 px-3 sm:px-6 md:px-8 pb-24 md:pb-12">

        {/* ── Header ── */}
        <header className="text-center mb-8 sm:mb-12 space-y-3 animate-fade-in pt-6 sm:pt-10 relative">
          <div className="inline-flex items-center justify-center p-3 sm:p-4 bg-black-800 border border-neon-dim/50 rounded-none mb-3 sm:mb-6 shadow-neon-dim animate-pulse-glow group hover:border-neon-bright hover:shadow-neon-hover transition-all duration-300">
            <Github className="w-8 h-8 sm:w-12 sm:h-12 text-neon-bright group-hover:scale-110 transition-transform duration-300" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white tracking-tighter uppercase relative inline-block">
            <span className="absolute -inset-1 blur-md bg-neon-green/20 opacity-50 mix-blend-overlay" />
            <GlitchText text="GH_ANALYZER" className="bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400" />
            <span className="text-neon-bright text-[9px] sm:text-xs font-mono absolute -top-3 -right-6 sm:-top-4 sm:-right-8 animate-pulse border border-neon-dim px-1 rounded-sm">v3.0</span>
          </h1>
          <div className="h-6 flex items-center justify-center">
            {showTypewriter && (
              <p className="text-neon-dim text-xs sm:text-base max-w-2xl mx-auto font-medium tracking-wide px-2">
                <span className="text-neon-bright mr-2">[SYS]</span>
                <Typewriter text={loading ? '>> SCANNING REPOSITORY...' : '>> AWAITING TARGET INPUT...'} delay={50} />
              </p>
            )}
          </div>
        </header>

        {/* ── Search Bar ── */}
        <div className="mb-8 sm:mb-14 w-full relative group">
          <div className="absolute -inset-0.5 bg-neon-dim blur opacity-20 group-hover:opacity-40 transition duration-500 animate-pulse" />
          <SearchBar onSearch={handleSearch} loading={loading} />
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="p-3 sm:p-4 bg-red-900/20 border border-red-500 text-red-400 mb-8 animate-fade-in flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="uppercase font-bold tracking-wider text-xs sm:text-sm break-words">{error}</p>
          </div>
        )}

        {/* ── No data: show Saved ── */}
        {!data && !loading && (
          <div className="max-w-xl mx-auto">
            <SavedProfiles currentData={null} currentUrl={null} onLoad={(url) => handleSearch(url)} />
          </div>
        )}

        {/* ── Data View ── */}
        {data && (
          <div className="space-y-4 sm:space-y-6 animate-slide-up">

            {/* ── Desktop Tab Bar (hidden on mobile — bottom nav handles it) ── */}
            <div className="hidden md:flex border-b border-neon-dim/20 overflow-x-auto scrollbar-hide">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 text-[10px] font-bold uppercase tracking-widest border-b-2 transition-all duration-200 whitespace-nowrap shrink-0
                    ${activeTab === tab.id
                      ? 'border-neon-bright text-neon-bright bg-neon-bright/5'
                      : 'border-transparent text-gray-500 hover:text-neon-dim hover:border-neon-dim/40'
                    }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ═══════════════════════ OVERVIEW ═══════════════════════ */}
            {activeTab === 'overview' && (
              <div className="space-y-6 sm:space-y-10">
                {/* Repo card + Persona */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch">
                  {/* Repo Card */}
                  <div className="lg:col-span-2 glass-card flex flex-col justify-between group !border-neon-dim/20 hover:!border-neon-bright/40 !p-4 sm:!p-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 relative z-10">
                      <img
                        src={data.summary.owner.avatar_url}
                        alt={data.summary.owner.login}
                        className="w-16 h-16 sm:w-24 sm:h-24 rounded-none border-2 border-neon-bright shadow-[0_0_15px_rgba(0,255,65,0.4)] shrink-0"
                      />
                      <div className="flex-1 space-y-2 min-w-0">
                        <span className="inline-block px-2 py-1 bg-neon-dim/10 text-neon-bright border border-neon-dim/40 text-[9px] font-bold uppercase">
                          {data.summary.language || 'UNKNOWN'}
                        </span>
                        <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tighter truncate">{data.summary.name}</h2>
                        <p className="text-gray-400 font-mono text-xs sm:text-sm leading-relaxed border-l-2 border-neon-dim/30 pl-3 line-clamp-3">
                          {data.summary.description || 'NO DATA PACKET RECEIVED.'}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 sm:gap-4 pt-4 sm:pt-8 border-t border-white/5 mt-4 sm:mt-8">
                      {[
                        { icon: <Star className="w-3 h-3 sm:w-4 sm:h-4 text-neon-bright mx-auto mb-1" />, val: data.summary.stars.toLocaleString(), label: 'Stars' },
                        { icon: <GitFork className="w-3 h-3 sm:w-4 sm:h-4 text-neon-dim mx-auto mb-1" />, val: data.summary.forks.toLocaleString(), label: 'Forks' },
                        { icon: <Target className="w-3 h-3 sm:w-4 sm:h-4 text-red-500/80 mx-auto mb-1" />, val: data.summary.open_issues, label: 'Issues' },
                        { icon: <Users className="w-3 h-3 sm:w-4 sm:h-4 text-white/70 mx-auto mb-1" />, val: data.contributors.length, label: 'Agents' },
                      ].map((s, i) => (
                        <div key={i} className="text-center p-2 sm:p-3 border border-white/5 bg-black-900/50">
                          {s.icon}
                          <div className="text-base sm:text-xl font-bold text-white">{s.val}</div>
                          <div className="text-[8px] sm:text-[9px] text-gray-500 uppercase tracking-widest">{s.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Persona */}
                  <div className="lg:col-span-1 min-h-[200px]">
                    <RepoPersona data={data} />
                  </div>
                </div>

                {/* Health Score */}
                <HealthScore data={data} />

                {/* Diagnostics + Terminal */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                  <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                    <div className="glass-card border-none bg-black-900/40 !p-4 sm:!p-6 border-l-4 border-neon-bright shadow-neon-dim flex flex-col justify-center">
                      <span className="text-neon-dim text-[9px] uppercase tracking-widest mb-1">Health Integrity</span>
                      <div className="text-lg sm:text-2xl font-bold text-white mb-2">DIAGNOSTIC_STABLE</div>
                      <div className="w-full bg-gray-900 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-neon-bright h-full shadow-[0_0_10px_rgba(57,255,20,0.5)]" style={{ width: '88%' }} />
                      </div>
                    </div>
                    <div className="glass-card border-none bg-black-900/40 !p-4 sm:!p-6 border-l-4 border-neon-dim flex flex-col justify-center">
                      <span className="text-neon-dim text-[9px] uppercase tracking-widest mb-1">Compute Load</span>
                      <div className="text-lg sm:text-2xl font-bold text-white mb-2">OPTIMAL_STATE</div>
                      <div className="text-[9px] text-gray-500 uppercase">SIGNAL: 99.4% // BUFFER: 0%</div>
                    </div>
                  </div>
                  <div className="lg:col-span-1">
                    <TerminalLog data={data} />
                  </div>
                </div>

                {/* Stat Cards + HypeMeter */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
                  <div className="lg:col-span-1 min-h-[180px]">
                    <HypeMeter data={data} />
                  </div>
                  <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
                    <StatCard title="Total Operations" value={data.summary.total_commits.toLocaleString()} icon={<GitCommit />} subtitle="Lifetime commits" />
                    <StatCard title="Bus Factor Risk" value={data.health.calculated_bus_factor < 2 ? 'CRITICAL' : 'STABLE'} icon={<Activity className={data.health.calculated_bus_factor < 2 ? 'text-red-500' : 'text-neon-bright'} />} subtitle={`Required Agents: ${data.health.calculated_bus_factor}`} />
                    <StatCard title="Bug Neutralization" value={`${data.health.closure_rate.toFixed(1)}%`} icon={<AlertCircle />} subtitle="Issue closure rate" />
                  </div>
                </div>

                {/* Charts + Leaderboard */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
                  <div className="xl:col-span-2 space-y-4 sm:space-y-8">
                    <h2 className="text-base sm:text-2xl font-bold text-white uppercase tracking-widest border-l-4 border-neon-bright pl-4">
                      {'>'} Data Streams
                    </h2>
                    <ChartGrid data={data} />
                  </div>
                  <div className="xl:col-span-1">
                    <Leaderboard contributors={data.contributors} />
                  </div>
                </div>

                {/* Skill Stack */}
                <SkillStack data={data} />
              </div>
            )}

            {/* ═══════════════════════ ANALYTICS ═══════════════════════ */}
            {activeTab === 'analytics' && (
              <div className="space-y-4 sm:space-y-8">
                <SectionHeader title="Activity Analytics" badge="LONG_TERM_VIEW" />
                <ActivityTrends data={data} />
                <GrowthBenchmarks data={data} />
              </div>
            )}

            {/* ═══════════════════════ ADVANCED ═══════════════════════ */}
            {activeTab === 'advanced' && (
              <div className="space-y-4 sm:space-y-8">
                <SectionHeader title="Advanced Insights" badge="DEEP_ANALYSIS" />
                <RepoInsights data={data} />
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-8">
                  <SkillStack data={data} />
                  <ProfileReport data={data} />
                </div>
              </div>
            )}

            {/* ═══════════════════════ COMPARE ═══════════════════════ */}
            {activeTab === 'compare' && (
              <div className="space-y-4 sm:space-y-8">
                <SectionHeader title="Profile Comparison" badge="DUAL_TARGET_MODE" />
                <ProfileComparison primaryData={data} />
              </div>
            )}

            {/* ═══════════════════════ PLACEMENT ═══════════════════════ */}
            {activeTab === 'placement' && (
              <div className="space-y-4 sm:space-y-8">
                <SectionHeader title="Placement Readiness" badge="STUDENT_MODE" />
                <PlacementScore data={data} />
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-8">
                  <HealthScore data={data} />
                  <SkillStack data={data} />
                </div>
              </div>
            )}

            {/* ═══════════════════════ SAVED ═══════════════════════ */}
            {activeTab === 'saved' && (
              <div className="space-y-4 sm:space-y-8">
                <SectionHeader title="Saved Profiles" badge="TRACKING" />
                <div className="max-w-2xl">
                  <SavedProfiles currentData={data} currentUrl={lastUrl} onLoad={(url) => handleSearch(url)} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════
          MOBILE BOTTOM NAVIGATION  (only visible when data is loaded)
      ══════════════════════════════════════════════════════════════ */}
      {data && (
        <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-black-900/95 backdrop-blur-md border-t border-neon-dim/30">
          <div className="flex items-stretch">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 text-[9px] font-bold uppercase tracking-wide transition-all duration-200 border-t-2 min-w-0
                  ${activeTab === tab.id
                    ? 'border-neon-bright text-neon-bright bg-neon-bright/5'
                    : 'border-transparent text-gray-600 hover:text-neon-dim'
                  }`}
              >
                {tab.icon}
                <span className="truncate w-full text-center leading-none">{tab.shortLabel}</span>
              </button>
            ))}
          </div>
          {/* Safe area for notched phones */}
          <div className="h-safe-area-inset-bottom bg-black-900/95" />
        </nav>
      )}
    </div>
  );
}

// ── Small helper ──
const SectionHeader = ({ title, badge }) => (
  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
    <h2 className="text-base sm:text-xl font-bold text-white uppercase tracking-widest border-l-4 border-neon-bright pl-3 sm:pl-4">{title}</h2>
    <span className="text-[9px] text-neon-dim font-mono border border-neon-dim/30 px-2 py-1">{badge}</span>
  </div>
);

export default App;
