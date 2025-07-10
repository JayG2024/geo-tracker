import React, { useState } from 'react';
import { TrendingUp, TrendingDown, AlertCircle, Lock, Sparkles, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';

interface ScoreDisplayProps {
  score: number;
  label: string;
  type: 'seo' | 'geo';
  previousScore?: number;
  breakdown?: {
    category: string;
    score: number;
    weight: number;
  }[];
}

// Circular Progress Score Display
export function CircularScoreDisplay({ score, label, type, previousScore }: ScoreDisplayProps) {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  const getScoreColor = (score: number) => {
    if (score >= 90) return type === 'seo' ? '#10b981' : '#3b82f6';
    if (score >= 70) return '#f59e0b';
    if (score >= 50) return '#f97316';
    return '#ef4444';
  };
  
  const trend = previousScore ? score - previousScore : 0;
  
  return (
    <div className="relative">
      <svg className="w-40 h-40 transform -rotate-90">
        {/* Background circle */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          stroke="#e5e7eb"
          strokeWidth="12"
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          stroke={getScoreColor(score)}
          strokeWidth="12"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-4xl font-bold" style={{ color: getScoreColor(score) }}>
          {score}
        </div>
        <div className="text-sm text-gray-600 font-medium">{label}</div>
        {trend !== 0 && (
          <div className={`flex items-center gap-1 mt-1 text-xs ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
    </div>
  );
}

// Speedometer Style Score Display
export function SpeedometerScore({ score, label, type }: ScoreDisplayProps) {
  const rotation = (score / 100) * 180 - 90;
  
  return (
    <div className="relative w-48 h-32 overflow-hidden">
      {/* Speedometer background */}
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-0 right-0 h-24 rounded-t-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 opacity-20"></div>
      </div>
      
      {/* Needle */}
      <div 
        className="absolute bottom-0 left-1/2 w-1 h-20 bg-gray-800 origin-bottom transition-transform duration-1000"
        style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
      >
        <div className="absolute top-0 left-1/2 w-3 h-3 bg-gray-800 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>
      
      {/* Center dot */}
      <div className="absolute bottom-0 left-1/2 w-4 h-4 bg-gray-800 rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
      
      {/* Score display */}
      <div className="absolute bottom-0 left-0 right-0 text-center">
        <div className="text-2xl font-bold">{score}</div>
        <div className="text-xs text-gray-600">{label}</div>
      </div>
    </div>
  );
}

// Grade Letter Display
export function GradeDisplay({ score, label, type }: ScoreDisplayProps) {
  const getGrade = (score: number) => {
    if (score >= 97) return 'A+';
    if (score >= 93) return 'A';
    if (score >= 90) return 'A-';
    if (score >= 87) return 'B+';
    if (score >= 83) return 'B';
    if (score >= 80) return 'B-';
    if (score >= 77) return 'C+';
    if (score >= 73) return 'C';
    if (score >= 70) return 'C-';
    if (score >= 67) return 'D+';
    if (score >= 63) return 'D';
    if (score >= 60) return 'D-';
    return 'F';
  };
  
  const grade = getGrade(score);
  const gradeColor = score >= 90 ? 'text-green-600' : score >= 80 ? 'text-blue-600' : score >= 70 ? 'text-yellow-600' : score >= 60 ? 'text-orange-600' : 'text-red-600';
  
  return (
    <div className="text-center">
      <div className={`text-6xl font-bold ${gradeColor}`}>{grade}</div>
      <div className="text-sm text-gray-600 mt-1">{label}</div>
      <div className="text-xs text-gray-500 mt-1">{score}/100</div>
    </div>
  );
}

// Progress Bar with Milestones
export function MilestoneProgressBar({ score, label, type }: ScoreDisplayProps) {
  const milestones = [
    { value: 0, label: 'Poor' },
    { value: 25, label: 'Fair' },
    { value: 50, label: 'Good' },
    { value: 75, label: 'Great' },
    { value: 100, label: 'Perfect' }
  ];
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-2xl font-bold">{score}</span>
      </div>
      
      <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            type === 'seo' ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gradient-to-r from-blue-400 to-blue-600'
          }`}
          style={{ width: `${score}%` }}
        />
        
        {/* Milestone markers */}
        <div className="absolute inset-0 flex justify-between px-1">
          {milestones.slice(1, -1).map((milestone) => (
            <div
              key={milestone.value}
              className="w-0.5 h-full bg-white opacity-50"
              style={{ marginLeft: `${milestone.value}%` }}
            />
          ))}
        </div>
      </div>
      
      {/* Milestone labels */}
      <div className="flex justify-between mt-1">
        {milestones.map((milestone) => (
          <span
            key={milestone.value}
            className={`text-xs ${score >= milestone.value ? 'text-gray-700 font-medium' : 'text-gray-400'}`}
          >
            {milestone.label}
          </span>
        ))}
      </div>
    </div>
  );
}

// Animated Score Counter
export function AnimatedScoreCounter({ score, label, type }: ScoreDisplayProps) {
  const [displayScore, setDisplayScore] = React.useState(0);
  
  React.useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = score / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setDisplayScore(score);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.round(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [score]);
  
  return (
    <div className="text-center">
      <div className="relative">
        <div className={`text-7xl font-bold ${
          type === 'seo' ? 'text-green-600' : 'text-blue-600'
        }`}>
          {displayScore}
        </div>
        <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-500 animate-pulse" />
      </div>
      <div className="text-lg text-gray-600 mt-2">{label}</div>
    </div>
  );
}