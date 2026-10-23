import React, { useState, useEffect, useRef } from 'react';
import { EducationTutorial } from '../../data/educationData';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Maximize2,
  CheckCircle2,
  X,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface TradingEducationPlayerProps {
  tutorial: EducationTutorial;
  onClose: () => void;
  onComplete: (id: string) => void;
  isCompleted: boolean;
}

export const TradingEducationPlayer: React.FC<TradingEducationPlayerProps> = ({
  tutorial,
  onClose,
  onComplete,
  isCompleted,
}) => {
  const { setSelectedAssetId, setAccountType, setActiveTab, showNotification } = useApp();

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [checkedTakeaways, setCheckedTakeaways] = useState<Record<number, boolean>>({});

  // Simulated video playback ticker
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= tutorial.durationSeconds) {
            setIsPlaying(false);
            onComplete(tutorial.id);
            showNotification(`Lesson Completed: ${tutorial.title}`, 'success');
            return tutorial.durationSeconds;
          }
          return prev + 1 * playbackSpeed;
        });
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, tutorial, onComplete, showNotification]);

  // Current script frame based on timestamp
  const currentFrame = [...tutorial.scriptFrames]
    .reverse()
    .find((f) => currentTime >= f.timeSec) || tutorial.scriptFrames[0];

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTime(parseFloat(e.target.value));
  };

  const handleSkip = (seconds: number) => {
    setCurrentTime((prev) =>
      Math.min(tutorial.durationSeconds, Math.max(0, prev + seconds))
    );
  };

  const handleApplyStrategy = () => {
    if (tutorial.category === 'Exotic Pairs') {
      setSelectedAssetId('usdkes');
    } else {
      setSelectedAssetId('eurusd');
    }
    setAccountType('demo');
    onClose();
    showNotification('Configured Demo Terminal for this strategy lesson.', 'info');
  };

  const toggleTakeaway = (idx: number) => {
    setCheckedTakeaways((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-3xl w-full p-6 space-y-5 text-neutral-100 shadow-2xl relative my-8">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-neutral-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800">
                {tutorial.category}
              </span>
              <span className="text-xs text-neutral-400">
                {tutorial.difficulty} Level · {tutorial.duration}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mt-1">
              {tutorial.title}
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Instructor: <span className="text-neutral-200">{tutorial.instructor}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded-md hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Canvas Simulation Screen */}
        <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 flex flex-col justify-between p-6 select-none shadow-inner">
          {/* Top screen bar */}
          <div className="flex items-center justify-between text-xs text-neutral-400 z-10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="font-mono text-[11px] text-neutral-300">
                WURLFX TRADING MASTERCLASS // 4K STREAM
              </span>
            </div>
            <div className="text-[11px] text-emerald-400 font-medium">
              Actionable Strategy Masterclass
            </div>
          </div>

          {/* Central Animated Lesson Board */}
          <div className="flex flex-col items-center justify-center text-center space-y-3 z-10 py-6 max-w-xl mx-auto">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/30">
              {currentFrame.visualType === 'formula'
                ? 'Mathematical Formula'
                : currentFrame.visualType === 'chart'
                ? 'Live Market Setup'
                : 'Execution Rule'}
            </span>

            <h4 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
              {currentFrame.headline}
            </h4>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-lg">
              {currentFrame.subtext}
            </p>

            {/* Simulated Live Equalizer / Pacing Waveform */}
            <div className="flex items-center gap-1 pt-2">
              {[12, 28, 16, 32, 24, 14, 30, 20, 10, 26, 18].map((h, i) => (
                <div
                  key={i}
                  className="w-1 bg-emerald-500 rounded-full transition-all duration-300"
                  style={{
                    height: isPlaying ? `${Math.max(6, (h * (i % 2 === 0 ? 1.2 : 0.7)) % 32)}px` : '4px',
                    opacity: isPlaying ? 0.8 : 0.3,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Bottom Video Controls Overlay */}
          <div className="space-y-2 z-10 pt-2 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent">
            {/* Timeline Progress Bar */}
            <div className="flex items-center gap-3 text-xs tabular-nums text-neutral-400">
              <span className="text-[11px]">{formatSeconds(currentTime)}</span>
              <input
                type="range"
                min={0}
                max={tutorial.durationSeconds}
                value={currentTime}
                onChange={handleSeek}
                className="flex-1 h-1.5 bg-neutral-800 accent-emerald-500 rounded cursor-pointer"
              />
              <span className="text-[11px] text-neutral-500">{tutorial.duration}</span>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between text-neutral-300">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-8 h-8 rounded-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 flex items-center justify-center transition-colors shadow"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>

                <button
                  onClick={() => handleSkip(-15)}
                  className="hover:text-white p-1"
                  title="Rewind 15 seconds"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleSkip(15)}
                  className="hover:text-white p-1"
                  title="Forward 15 seconds"
                >
                  <RotateCw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="hover:text-white p-1"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs">
                {/* Playback speed selector */}
                <button
                  onClick={() =>
                    setPlaybackSpeed((prev) => (prev === 1 ? 1.5 : prev === 1.5 ? 2 : 1))
                  }
                  className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[11px] font-mono hover:text-white"
                >
                  {playbackSpeed}x
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Actionable Strategy Rule Banner */}
        <div className="p-3.5 bg-neutral-950 rounded-xl border border-emerald-500/30 flex items-start gap-3">
          <Zap className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
              Core Actionable Rule:
            </span>
            <p className="text-xs text-white font-medium leading-relaxed">
              {tutorial.actionableRule}
            </p>
          </div>
        </div>

        {/* Key Takeaways Checklist */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-neutral-300 uppercase tracking-wider text-[11px]">
              Key Takeaways Checklist (Click to Mark Understood)
            </span>
            <span className="text-[11px] text-neutral-500">
              {Object.values(checkedTakeaways).filter(Boolean).length} of {tutorial.keyTakeaways.length} mastered
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {tutorial.keyTakeaways.map((item, idx) => {
              const checked = !!checkedTakeaways[idx];
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => toggleTakeaway(idx)}
                  className={`p-2.5 rounded-lg border text-left flex items-start gap-2.5 transition-colors ${
                    checked
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                  }`}
                >
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 mt-0.5 ${
                      checked ? 'text-emerald-400' : 'text-neutral-600'
                    }`}
                  />
                  <span className="text-[11px] leading-relaxed">{item}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-neutral-800">
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Apply risk rules on your $10,000 Demo balance before using Real capital.</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => onComplete(tutorial.id)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                isCompleted
                  ? 'bg-neutral-800 text-emerald-400'
                  : 'bg-neutral-800 hover:bg-neutral-700 text-white'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isCompleted ? 'Marked Completed' : 'Mark Lesson Complete'}</span>
            </button>

            <button
              onClick={handleApplyStrategy}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-sm"
            >
              <span>Practice on Terminal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
