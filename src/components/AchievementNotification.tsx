import { useEffect, useState } from 'react';
import { Achievement, RARITY_COLORS } from '@/data/achievements';
import { cn } from '@/utils/cn';

interface AchievementNotificationProps {
  achievement: Achievement;
  onClose: () => void;
}

export function AchievementNotification({ achievement, onClose }: AchievementNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  
  const colors = RARITY_COLORS[achievement.rarity];

  useEffect(() => {
    // Animate in
    setTimeout(() => setIsVisible(true), 50);
    
    // Auto close after 3 seconds
    const timer = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(onClose, 300);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div 
      className={cn(
        "fixed top-4 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 max-w-sm w-full px-4",
        isVisible && !isLeaving ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      )}
      onClick={() => {
        setIsLeaving(true);
        setTimeout(onClose, 300);
      }}
    >
      <div className={cn(
        "rounded-2xl p-4 border backdrop-blur-xl shadow-2xl",
        colors.bg,
        colors.border
      )}>
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div className={cn(
            "w-14 h-14 rounded-xl flex items-center justify-center text-3xl",
            "bg-gradient-to-br from-white/10 to-white/5 border",
            colors.border
          )}>
            {achievement.icon}
          </div>
          
          {/* Content */}
          <div className="flex-1">
            <p className="text-amber-400 text-xs font-semibold uppercase tracking-wider mb-0.5">
              Achievement Unlocked!
            </p>
            <h3 className="text-white font-bold text-lg">{achievement.name}</h3>
            <p className="text-slate-400 text-sm">{achievement.description}</p>
          </div>
        </div>
        
        {/* Rarity badge */}
        <div className="mt-3 flex items-center justify-between">
          <span className={cn(
            "px-2 py-0.5 rounded-full text-xs font-medium capitalize",
            colors.bg,
            colors.text
          )}>
            {achievement.rarity}
          </span>
          <span className="text-slate-500 text-xs">Tap to dismiss</span>
        </div>
      </div>
    </div>
  );
}
