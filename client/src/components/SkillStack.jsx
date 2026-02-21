import React, { useMemo } from 'react';
import { Code, Layers, Cpu } from 'lucide-react';

const COLORS = ['#00ff41', '#00f3ff', '#ff00ff', '#fcee0a', '#bc13fe', '#ff3131', '#ff3131', '#ffffff'];

// Map languages to frameworks/tools commonly used
const FRAMEWORK_MAP = {
    JavaScript: ['React', 'Node.js', 'Express', 'Vue', 'Next.js'],
    TypeScript: ['Angular', 'NestJS', 'TypeORM', 'Prisma'],
    Python: ['Django', 'Flask', 'FastAPI', 'NumPy', 'Pandas', 'TensorFlow'],
    Java: ['Spring Boot', 'Maven', 'Hibernate'],
    'C++': ['CMake', 'Boost', 'OpenGL'],
    Go: ['Gin', 'Echo', 'gRPC'],
    Rust: ['Actix', 'Tokio', 'Serde'],
    Ruby: ['Rails', 'RSpec', 'Sinatra'],
    PHP: ['Laravel', 'Symfony', 'WordPress'],
    Swift: ['SwiftUI', 'UIKit', 'Combine'],
    Kotlin: ['Ktor', 'Jetpack Compose', 'Android SDK'],
    CSS: ['Sass', 'Bootstrap', 'Tailwind CSS'],
    SCSS: ['Sass', 'PostCSS'],
    HTML: ['Webpack', 'Vite'],
    Shell: ['Bash', 'Docker', 'CI/CD'],
    Dockerfile: ['Docker', 'Container'],
    Vue: ['Vuex', 'Nuxt.js'],
    Dart: ['Flutter', 'Riverpod'],
    'C#': ['ASP.NET', 'Unity', '.NET'],
    R: ['Tidyverse', 'ggplot2', 'Shiny'],
    Scala: ['Akka', 'Spark', 'Play'],
};

const DOMAIN_MAP = {
    JavaScript: 'Web Frontend',
    TypeScript: 'Full Stack',
    Python: 'Data Science / Backend',
    Java: 'Enterprise Backend',
    'C++': 'Systems / Game Dev',
    Go: 'Cloud / Infrastructure',
    Rust: 'Systems Programming',
    Ruby: 'Web Backend',
    PHP: 'Web Backend',
    Swift: 'iOS Development',
    Kotlin: 'Android Development',
    Dart: 'Mobile Development',
    'C#': 'Game Dev / .NET',
    R: 'Data Science',
    Scala: 'Big Data',
    Shell: 'DevOps',
    Dockerfile: 'DevOps / Container',
};

const SkillStack = ({ data }) => {
    const analysis = useMemo(() => {
        if (!data) return null;
        const langEntries = Object.entries(data.languages || {});
        const totalBytes = langEntries.reduce((s, [, v]) => s + v, 0);

        const languages = langEntries
            .sort((a, b) => b[1] - a[1])
            .map(([name, bytes]) => ({
                name,
                bytes,
                pct: Math.round((bytes / Math.max(totalBytes, 1)) * 100),
            }));

        const primaryLang = languages[0]?.name;
        const inferredFrameworks = [...new Set(
            languages.flatMap(l => FRAMEWORK_MAP[l.name] || []).slice(0, 8)
        )];
        const domain = DOMAIN_MAP[primaryLang] || 'General Engineering';
        const specializations = languages
            .filter(l => l.pct >= 5)
            .map(l => DOMAIN_MAP[l.name])
            .filter(Boolean)
            .filter((v, i, a) => a.indexOf(v) === i);

        const expertise = languages[0]?.pct >= 80 ? 'Specialist' : languages.length >= 4 ? 'Full-Stack / Polyglot' : 'Generalist';

        return { languages, inferredFrameworks, domain, expertise, specializations, primaryLang };
    }, [data]);

    if (!analysis) return null;

    return (
        <div className="glass-card !p-0 overflow-hidden border-neon-dim/20 bg-black-800/80">
            {/* Header */}
            <div className="p-4 border-b border-neon-dim/20 bg-neon-dim/5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-neon-bright" />
                    <h3 className="text-neon-bright font-bold text-xs uppercase tracking-[0.2em]">Skill & Tech Stack Inference</h3>
                </div>
                <span className="text-[10px] text-neon-dim font-mono">AUTO_DETECTED</span>
            </div>

            <div className="p-6 space-y-6">
                {/* Primary Badge */}
                <div className="flex flex-wrap gap-3">
                    <div className="border border-neon-bright/50 bg-neon-bright/5 px-4 py-2">
                        <span className="text-[9px] text-gray-500 uppercase block tracking-wider mb-1">Domain</span>
                        <span className="text-neon-bright text-sm font-bold">{analysis.domain}</span>
                    </div>
                    <div className="border border-cyan-500/50 bg-cyan-500/5 px-4 py-2">
                        <span className="text-[9px] text-gray-500 uppercase block tracking-wider mb-1">Profile Type</span>
                        <span className="text-cyan-400 text-sm font-bold">{analysis.expertise}</span>
                    </div>
                </div>

                {/* Language Bars */}
                <div>
                    <h4 className="text-[10px] text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Layers className="w-3 h-3" /> Language Proficiency
                    </h4>
                    <div className="space-y-2">
                        {analysis.languages.slice(0, 7).map((lang, i) => (
                            <div key={lang.name} className="space-y-1">
                                <div className="flex justify-between text-[10px] font-mono">
                                    <span className="text-white">{lang.name}</span>
                                    <span style={{ color: COLORS[i % COLORS.length] }}>{lang.pct}%</span>
                                </div>
                                <div className="w-full h-2 bg-black-900 border border-neon-dim/10 overflow-hidden">
                                    <div
                                        className="h-full transition-all duration-1000 ease-out"
                                        style={{
                                            width: `${lang.pct}%`,
                                            background: COLORS[i % COLORS.length],
                                            boxShadow: `0 0 6px ${COLORS[i % COLORS.length]}80`
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Inferred Frameworks */}
                {analysis.inferredFrameworks.length > 0 && (
                    <div>
                        <h4 className="text-[10px] text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Cpu className="w-3 h-3" /> Inferred Frameworks / Tools
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {analysis.inferredFrameworks.map((fw, i) => (
                                <span
                                    key={fw}
                                    className="px-2 py-1 text-[10px] font-mono border font-bold uppercase"
                                    style={{ borderColor: `${COLORS[i % COLORS.length]}50`, color: COLORS[i % COLORS.length], background: `${COLORS[i % COLORS.length]}08` }}
                                >
                                    {fw}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Specializations */}
                {analysis.specializations.length > 1 && (
                    <div>
                        <h4 className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Specialization Areas</h4>
                        <div className="flex flex-wrap gap-2">
                            {analysis.specializations.map((s, i) => (
                                <span key={s} className="px-2 py-1 text-[9px] font-mono border border-white/10 text-gray-300 uppercase bg-black-900/50">{s}</span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="h-6 border-t border-neon-dim/10 bg-black-900/50 flex items-center justify-between px-4 text-[9px] text-gray-500 font-mono uppercase tracking-wider">
                <span>STACK_INFERENCE :: ML_v1.0</span>
                <span>PRIMARY: {analysis.primaryLang || 'N/A'}</span>
            </div>
        </div>
    );
};

export default SkillStack;
