import React, { useState } from 'react';
import { EDUCATION_TUTORIALS, EducationTutorial } from '../../data/educationData';
import { TradingEducationPlayer } from './TradingEducationPlayer';
import {
  Play,
  GraduationCap,
  Clock,
  CheckCircle2,
  Shield,
  Zap,
  BookOpen,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TradingEducationSection: React.FC = () => {
  const { showNotification } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedTutorial, setSelectedTutorial] = useState<EducationTutorial | null>(null);
  const [completedLessonIds, setCompletedLessonIds] = useState<Record<string, boolean>>({
    'tut-risk-1': true,
  });

  const categories = [
    'All',
    'Risk Management',
    'Forex Strategies',
    'Exotic Pairs',
    'Psychology',
  ];

  const filteredTutorials = EDUCATION_TUTORIALS.filter((tut) => {
    return activeCategory === 'All' || tut.category === activeCategory;
  });

  const handleLessonComplete = (id: string) => {
    setCompletedLessonIds((prev) => ({ ...prev, [id]: true }));
  };

  const completedCount = Object.values(completedLessonIds).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / EDUCATION_TUTORIALS.length) * 100);

  return (
    <div id="trading-academy" className="space-y-6 pt-4 scroll-mt-6">
      {/* Academy Showcase Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[220px]">
          <div className="lg:col-span-7 p-6 sm:p-7 flex flex-col justify-between space-y-3 z-10">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  WurlFX Trading Academy
                </span>
                <span className="text-xs text-neutral-400">
                  Directed by Wurl_Sphilah
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Forex Strategies &amp; Risk Management Masterclass
              </h3>

              <p className="text-xs text-neutral-300 leading-relaxed max-w-xl">
                Short, actionable video tutorials built for fast practical execution. Master the 1% risk rule, asymmetric risk-reward, candlestick confirmations, and USD/KES exotic pair dynamics.
              </p>
            </div>

            {/* Course Progress Track */}
            <div className="space-y-1.5 pt-2 max-w-md">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400 font-medium">Academy Curriculum Progress</span>
                <span className="font-bold text-emerald-400 tabular-nums">
                  {completedCount} of {EDUCATION_TUTORIALS.length} Completed ({progressPercent}%)
                </span>
              </div>
              <div className="w-full bg-neutral-950 h-2 rounded-full overflow-hidden border border-neutral-800">
                <div
                  className="bg-emerald-500 h-full transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative min-h-[180px] lg:min-h-full">
            <img
              src="/src/assets/images/wurlfx_academy_hero_1792573362032.jpg"
              alt="WurlFX Trading Education Masterclass"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-neutral-900 via-transparent to-transparent" />
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-neutral-800 text-white border border-neutral-700 font-semibold'
                  : 'text-neutral-400 hover:text-white bg-neutral-950 border border-neutral-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="text-xs text-neutral-400 flex items-center gap-2">
          <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
          <span>6 Actionable Video Modules · 100% Free on Terminal</span>
        </div>
      </div>

      {/* Tutorials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTutorials.map((tut) => {
          const isDone = !!completedLessonIds[tut.id];
          return (
            <div
              key={tut.id}
              className={`rounded-xl p-5 flex flex-col justify-between border transition-all group ${
                isDone
                  ? 'bg-neutral-950 border-neutral-800/80 hover:border-neutral-700'
                  : 'bg-neutral-950 border-neutral-800 hover:border-emerald-500/40 shadow-sm'
              }`}
            >
              <div className="space-y-3">
                {/* Meta header */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800">
                      {tut.category}
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      {tut.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                    <Clock className="w-3.5 h-3.5 text-neutral-500" />
                    <span className="font-mono text-[11px]">{tut.duration}</span>
                  </div>
                </div>

                {/* Title & summary */}
                <div>
                  <h4 className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors">
                    {tut.title}
                  </h4>
                  <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                    {tut.summary}
                  </p>
                </div>

                {/* Actionable Rule Preview */}
                <div className="p-2.5 bg-neutral-900/60 rounded-lg border border-neutral-800/80 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-emerald-400" />
                    <span>Actionable Strategy Rule</span>
                  </span>
                  <p className="text-[11px] text-neutral-200 line-clamp-2 font-medium">
                    {tut.actionableRule}
                  </p>
                </div>
              </div>

              {/* Card Footer Button */}
              <div className="pt-4 mt-4 border-t border-neutral-900 flex items-center justify-between">
                <span className="text-[11px] text-neutral-500">
                  {tut.instructor.split(' ')[0]} Masterclass
                </span>

                <button
                  onClick={() => setSelectedTutorial(tut)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
                    isDone
                      ? 'bg-neutral-900 hover:bg-neutral-800 text-emerald-400 border border-neutral-800'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-extrabold'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isDone ? 'Rewatch' : 'Watch Tutorial'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Video Tutorial Player Modal */}
      {selectedTutorial && (
        <TradingEducationPlayer
          tutorial={selectedTutorial}
          onClose={() => setSelectedTutorial(null)}
          onComplete={handleLessonComplete}
          isCompleted={!!completedLessonIds[selectedTutorial.id]}
        />
      )}
    </div>
  );
};
