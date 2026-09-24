
import { useApp } from '@/contexts/AppContext';
import { BADGE_DEFS, checkAndAwardBadges, updateUser } from '@/lib/storage';
import { toast } from 'sonner';

export default function AchievementsPage() {
  const { user, refreshUser } = useApp();
  if (!user) return null;

  const earnedBadges = new Set(user.badges);

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto animate-pixel-fade">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-1">Achievements</h1>
        <p className="text-muted-foreground text-sm">{earnedBadges.size} / {BADGE_DEFS.length} badges earned</p>
      </div>

      <div className="pixel-progress mb-6">
        <div className="pixel-progress-fill" style={{ width: `${Math.round((earnedBadges.size / BADGE_DEFS.length) * 100)}%` }} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {BADGE_DEFS.map(badge => {
          const earned = earnedBadges.has(badge.id);
          return (
            <div key={badge.id}
              className={`pixel-card p-4 flex items-start gap-4 ${earned ? 'badge-earned' : 'opacity-50'}`}>
              <div className="text-3xl shrink-0" style={{ filter: earned ? 'none' : 'grayscale(1) opacity(0.4)' }}>
                {badge.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className={`font-semibold text-sm mb-1 ${earned ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {badge.name}
                </h4>
                <p className="text-muted-foreground text-xs">{badge.desc}</p>
                {earned && (
                  <span className="inline-block mt-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                    ✓ Earned
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="pixel-card p-5 mt-8">
        <h3 className="font-semibold text-foreground mb-3">How to earn more badges</h3>
        <ul className="space-y-1.5 text-muted-foreground text-sm">
          <li>• Complete quizzes for each gate type</li>
          <li>• Score 100% on any quiz to earn the Perfectionist badge</li>
          <li>• Build a circuit in Circuit Builder</li>
          <li>• Play all 6 games at least once</li>
          <li>• Reach level 5 by earning XP across all activities</li>
          <li>• Get 3 stars on 10+ game levels</li>
          <li>• Unlock all 8 gate topics</li>
        </ul>
      </div>
    </div>
  );
}
