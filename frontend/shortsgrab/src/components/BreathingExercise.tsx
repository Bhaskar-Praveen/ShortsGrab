import { useEffect, useState } from 'react';

interface BreathingExerciseProps {
  isDarkMode: boolean; 
  onComplete?: () => void;
}

type BreathPhase = 'breathe-in' | 'hold' | 'breathe-out' | 'rest';

export default function BreathingExercise({ isDarkMode, onComplete }: BreathingExerciseProps) {
  const [phase, setPhase] = useState<BreathPhase>('breathe-in');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const phases: { phase: BreathPhase; duration: number; text: string }[] = [
      { phase: 'breathe-in', duration: 4000, text: 'Breathe In' },
      { phase: 'hold', duration: 2000, text: 'Hold' },
      { phase: 'breathe-out', duration: 4000, text: 'Breathe Out' },
      { phase: 'rest', duration: 2000, text: 'Rest' }
    ];

    let currentPhaseIndex = 0;
    let startTime = Date.now();

    const updatePhase = () => {
      const currentPhase = phases[currentPhaseIndex];
      const elapsed = Date.now() - startTime;
      const phaseProgress = Math.min((elapsed / currentPhase.duration) * 100, 100);
      
      setProgress(phaseProgress);

      if (elapsed >= currentPhase.duration) {
        currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;
        startTime = Date.now();
        setPhase(phases[currentPhaseIndex].phase);
        
        if (currentPhaseIndex === 0 && onComplete) {
          // onComplete();
        }
      }
    };

    const interval = setInterval(updatePhase, 50);

    return () => clearInterval(interval);
  }, [onComplete]);

  const getPhaseText = () => {
    switch (phase) {
      case 'breathe-in':
        return 'Breathe In';
      case 'hold':
        return 'Hold';
      case 'breathe-out':
        return 'Breathe Out';
      case 'rest':
        return 'Rest';
    }
  };

  const getCircleScale = () => {
    switch (phase) {
      case 'breathe-in':
        return 1 + (progress / 100) * 0.5;
      case 'hold':
        return 1.5;
      case 'breathe-out':
        return 1.5 - (progress / 100) * 0.5;
      case 'rest':
        return 1;
    }
  };

  const getCircleColor = () => {
    switch (phase) {
      case 'breathe-in':
        return 'from-blue-500 to-cyan-500';
      case 'hold':
        return 'from-purple-500 to-pink-500';
      case 'breathe-out':
        return 'from-green-500 to-emerald-500';
      case 'rest':
        return 'from-gray-600 to-gray-700';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* Breathing Circle */}
      <div className="relative w-64 h-64 flex items-center justify-center mb-8">
        {/* Outer glow rings */}
        <div 
          className="absolute inset-0 rounded-full opacity-20 blur-2xl"
          style={{
            background: `linear-gradient(135deg, ${phase === 'breathe-in' ? '#3b82f6' : phase === 'hold' ? '#a855f7' : phase === 'breathe-out' ? '#10b981' : '#6b7280'}, ${phase === 'breathe-in' ? '#06b6d4' : phase === 'hold' ? '#ec4899' : phase === 'breathe-out' ? '#059669' : '#4b5563'})`,
            transform: `scale(${getCircleScale()})`,
            transition: 'transform 0.3s ease-out'
          }}
        />
        
        {/* Main breathing circle */}
        <div 
          className={`absolute w-48 h-48 rounded-full bg-gradient-to-br ${getCircleColor()} shadow-2xl flex items-center justify-center`}
          style={{
            transform: `scale(${getCircleScale()})`,
            transition: 'all 0.3s ease-out'
          }}
        >
          <div className="text-white text-center">
            <div className="text-3xl font-bold mb-2">{getPhaseText()}</div>
            <div className="text-sm opacity-75">
              {phase === 'breathe-in' && '4 seconds'}
              {phase === 'hold' && '2 seconds'}
              {phase === 'breathe-out' && '4 seconds'}
              {phase === 'rest' && '2 seconds'}
            </div>
          </div>
        </div>

        {/* Particle effects */}
        {phase === 'breathe-in' && (
          <>
            <div className="absolute w-2 h-2 bg-blue-400 rounded-full animate-ping" style={{ top: '20%', left: '30%' }} />
            <div className="absolute w-2 h-2 bg-cyan-400 rounded-full animate-ping animation-delay-500" style={{ top: '70%', right: '30%' }} />
            <div className="absolute w-2 h-2 bg-blue-300 rounded-full animate-ping animation-delay-1000" style={{ bottom: '20%', left: '40%' }} />
          </>
        )}
      </div>

      {/* Instruction Text */}
      <div className="text-center space-y-2">
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Preparing your download...
        </p>
        <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
          Take a moment to relax while we process your request
        </p>
      </div>

      {/* Progress indicator dots */}
      <div className="flex gap-2 mt-6">
        <div className={`w-2 h-2 rounded-full transition-all ${phase === 'breathe-in' ? 'bg-blue-500 w-6' : isDarkMode ? 'bg-gray-600' : 'bg-gray-400'}`} />
        <div className={`w-2 h-2 rounded-full transition-all ${phase === 'hold' ? 'bg-purple-500 w-6' : isDarkMode ? 'bg-gray-600' : 'bg-gray-400'}`} />
        <div className={`w-2 h-2 rounded-full transition-all ${phase === 'breathe-out' ? 'bg-green-500 w-6' : isDarkMode ? 'bg-gray-600' : 'bg-gray-400'}`} />
        <div className={`w-2 h-2 rounded-full transition-all ${phase === 'rest' ? 'bg-gray-500 w-6' : isDarkMode ? 'bg-gray-600' : 'bg-gray-400'}`} />
      </div>
    </div>
  );
}
