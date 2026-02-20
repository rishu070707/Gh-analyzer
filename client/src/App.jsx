import React, { useState, useEffect } from 'react';
import { Github, Users, GitCommit, AlertCircle, ExternalLink, Activity, Star, GitFork, Clock, Zap, Target } from 'lucide-react';
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
import { analyzeRepo } from './services/api';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTypewriter, setShowTypewriter] = useState(true);
  const [tokenModalOpen, setTokenModalOpen] = useState(false);
  const [pendingUrl, setPendingUrl] = useState('');

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

    try {
      const result = await analyzeRepo(url, token);
      setData(result.data);
      setTokenModalOpen(false);
    } catch (err) {
      const errorMessage = err.error || err.message || 'Failed to analyze repository.';
      setError(errorMessage);
      if (errorMessage.toLowerCase().includes('rate limit') || errorMessage.toLowerCase().includes('token')) {
        setTokenModalOpen(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTokenSubmit = (token) => {
    if (pendingUrl && token) {
      handleSearch(pendingUrl, token);
    }
  };

  return (
    <div className="min-h-screen text-gray-300 p-4 md:p-8 font-mono selection:bg-neon-green/30 selection:text-white relative overflow-hidden">
      {tokenModalOpen && (
        <TokenModal
          onSubmit={handleTokenSubmit}
          onCancel={() => setTokenModalOpen(false)}
          error={error}
        />
      )}

      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,65,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] animate-grid-scroll"></div>
        <div className="absolute inset-0 bg-black-900/90"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="text-center mb-16 space-y-4 animate-fade-in pt-10 relative">
          <div className="inline-flex items-center justify-center p-4 bg-black-800 border border-neon-dim/50 rounded-none mb-6 shadow-neon-dim animate-pulse-glow group hover:border-neon-bright hover:shadow-neon-hover transition-all duration-300">
            <Github className="w-12 h-12 text-neon-bright group-hover:scale-110 transition-transform duration-300" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tighter uppercase relative inline-block">
            <span className="absolute -inset-1 blur-md bg-neon-green/20 opacity-50 mix-blend-overlay"></span>
            <GlitchText text="GH_ANALYZER" className="bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400" />
            <span className="text-neon-bright text-xs md:text-sm font-mono absolute -top-4 -right-8 animate-pulse border border-neon-dim px-1 rounded-sm">v2.1.0</span>
          </h1>
          <div className="h-8 flex items-center justify-center">
            {showTypewriter && (
              <p className="text-neon-dim text-lg max-w-2xl mx-auto font-medium tracking-wide">
                <span className="text-neon-bright mr-2">[SYSTEM]</span>
                <Typewriter text={loading ? ">> SCANNING REPOSITORY..." : ">> AWAITING TARGET INPUT..."} delay={50} />
              </p>
            )}
          </div>
        </header>

        <div className="mb-20 max-w-3xl mx-auto relative group">
          <div className="absolute -inset-0.5 bg-neon-dim blur opacity-20 group-hover:opacity-40 transition duration-500 animate-pulse"></div>
          <SearchBar onSearch={handleSearch} loading={loading} />
        </div>

        {error && (
          <div className="max-w-2xl mx-auto p-4 bg-red-900/20 border border-red-500 text-red-400 mb-12 animate-fade-in font-mono flex items-center gap-4">
            <AlertCircle className="w-6 h-6 flex-shrink-0" />
            <p className="uppercase font-bold tracking-widest text-sm">Error: {error}</p>
          </div>
        )}

        {data && (
          <div className="space-y-12 animate-slide-up pb-20">
            {/* Row 1: Primary Discovery */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
              <div className="lg:col-span-2 glass-card flex flex-col justify-between group !border-neon-dim/20 hover:!border-neon-bright/40 p-8">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-8 relative z-10">
                  <img
                    src={data.summary.owner.avatar_url}
                    alt={data.summary.owner.login}
                    className="w-24 h-24 rounded-none border-2 border-neon-bright shadow-[0_0_15px_rgba(0,255,65,0.4)]"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-1 bg-neon-dim/10 text-neon-bright border border-neon-dim/40 text-[10px] font-bold uppercase">
                        {data.summary.language || 'UNKNOWN'}
                      </span>
                    </div>
                    <h2 className="text-4xl font-bold text-white tracking-tighter truncate">{data.summary.name}</h2>
                    <p className="text-gray-400 font-mono text-sm leading-relaxed border-l-2 border-neon-dim/30 pl-4">
                      {data.summary.description || "NO DATA PACKET RECEIVED."}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-white/5 mt-8">
                  <div className="text-center p-3 border border-white/5 bg-black-900/50">
                    <Star className="w-4 h-4 text-neon-bright mx-auto mb-2" />
                    <div className="text-xl font-bold text-white">{data.summary.stars.toLocaleString()}</div>
                    <div className="text-[9px] text-gray-500 uppercase tracking-widest">Stars</div>
                  </div>
                  <div className="text-center p-3 border border-white/5 bg-black-900/50">
                    <GitFork className="w-4 h-4 text-neon-dim mx-auto mb-2" />
                    <div className="text-xl font-bold text-white">{data.summary.forks.toLocaleString()}</div>
                    <div className="text-[9px] text-gray-500 uppercase tracking-widest">Forks</div>
                  </div>
                  <div className="text-center p-3 border border-white/5 bg-black-900/50">
                    <Target className="w-4 h-4 text-red-500/80 mx-auto mb-2" />
                    <div className="text-xl font-bold text-white">{data.summary.open_issues}</div>
                    <div className="text-[9px] text-gray-500 uppercase tracking-widest">Issues</div>
                  </div>
                  <div className="text-center p-3 border border-white/5 bg-black-900/50">
                    <Users className="w-4 h-4 text-white/70 mx-auto mb-2" />
                    <div className="text-xl font-bold text-white">{data.contributors.length}</div>
                    <div className="text-[9px] text-gray-500 uppercase tracking-widest">Agents</div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <RepoPersona data={data} />
              </div>
            </div>

            {/* Row 2: Diagnostics & Terminal */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card border-none bg-black-900/40 p-6 border-l-4 border-neon-bright shadow-neon-dim flex flex-col justify-center">
                  <span className="text-neon-dim text-[10px] uppercase tracking-widest mb-1">Health Integrity</span>
                  <div className="text-2xl font-bold text-white mb-2">DIAGNOSTIC_STABLE</div>
                  <div className="w-full bg-gray-900 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-neon-bright h-full shadow-[0_0_10px_rgba(57,255,20,0.5)]" style={{ width: '88%' }}></div>
                  </div>
                </div>
                <div className="glass-card border-none bg-black-900/40 p-6 border-l-4 border-neon-dim flex flex-col justify-center">
                  <span className="text-neon-dim text-[10px] uppercase tracking-widest mb-1">Compute Load</span>
                  <div className="text-2xl font-bold text-white mb-2">OPTIMAL_STATE</div>
                  <div className="text-[10px] text-gray-500 uppercase">SIGNAL_STRENGTH: 99.4% // BUFFER: 0%</div>
                </div>
              </div>
              <div className="lg:col-span-1">
                <TerminalLog data={data} />
              </div>
            </div>

            {/* Row 3: Core Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1">
                <HypeMeter data={data} />
              </div>
              <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                  title="Total Operations"
                  value={data.summary.total_commits.toLocaleString()}
                  icon={<GitCommit />}
                  subtitle="Lifetime commits executed"
                />
                <StatCard
                  title="Bus Factor Risk"
                  value={data.health.calculated_bus_factor < 2 ? "CRITICAL" : "STABLE"}
                  icon={<Activity className={data.health.calculated_bus_factor < 2 ? 'text-red-500' : 'text-neon-bright'} />}
                  subtitle={`Required Agents: ${data.health.calculated_bus_factor}`}
                />
                <StatCard
                  title="Bug Neutralization"
                  value={`${data.health.closure_rate.toFixed(1)}%`}
                  icon={<AlertCircle />}
                  subtitle="Issue closure efficiency"
                />
              </div>
            </div>

            {/* Row 4: Visualizations */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2 space-y-8">
                <h2 className="text-2xl font-bold text-white uppercase tracking-widest border-l-4 border-neon-bright pl-4">
                  {'>'} Visualizing Data Streams
                </h2>
                <ChartGrid data={data} />
              </div>
              <div className="xl:col-span-1">
                <Leaderboard contributors={data.contributors} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
