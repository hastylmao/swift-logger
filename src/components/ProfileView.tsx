import { useState } from 'react';
import { 
  User, 
  Ruler, 
  Weight, 
  ChevronRight,
  Check,
  Plus,
  Trash2,
  Edit3,
  X
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { DEFAULT_SPLITS } from '@/data/splits';
import { 
  UserProfile, 
  Split, 
  SplitDay,
  ACTIVITY_MULTIPLIERS, 
  GOAL_MODIFIERS,
  MUSCLE_GROUPS 
} from '@/types';
import { cn } from '@/utils/cn';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function ProfileView() {
  const { 
    profile, 
    setProfile, 
    activeSplit, 
    setActiveSplit,
    customSplits,
    addCustomSplit,
    deleteCustomSplit,
    calculateBMR,
    calculateTDEE,
    calculateTargetCalories,
    calculateWaterGoal
  } = useStore();

  const [showProfileModal, setShowProfileModal] = useState(!profile);
  const [showSplitModal, setShowSplitModal] = useState(false);
  const [showCustomSplitModal, setShowCustomSplitModal] = useState(false);

  const allSplits = [...DEFAULT_SPLITS, ...customSplits];

  return (
    <div className="space-y-4 pb-24">
      {/* Profile Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-5 border border-cyan-500/20">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <User className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-white text-xl font-bold">
                {profile?.name || 'Set Up Profile'}
              </h2>
              {profile && (
                <p className="text-slate-400 text-sm">
                  {profile.age} years • {profile.gender === 'male' ? 'Male' : 'Female'}
                </p>
              )}
            </div>
          </div>
          <button 
            onClick={() => setShowProfileModal(true)}
            className="p-2 rounded-lg bg-slate-800 text-cyan-400 hover:bg-slate-700 transition-colors"
          >
            <Edit3 className="w-5 h-5" />
          </button>
        </div>
        
        {profile && (
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                <Ruler className="w-3 h-3" />
                Height
              </div>
              <p className="text-white font-semibold">{profile.height} cm</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                <Weight className="w-3 h-3" />
                Current
              </div>
              <p className="text-white font-semibold">{profile.weight} kg</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                <Weight className="w-3 h-3" />
                Started At
              </div>
              <p className="text-white font-semibold">{profile.startingWeight || profile.weight} kg</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                <Weight className="w-3 h-3" />
                Goal
              </div>
              <p className="text-cyan-400 font-semibold">{profile.goalWeight || profile.weight} kg</p>
            </div>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      {profile && (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
            <p className="text-slate-400 text-xs mb-1">BMR</p>
            <p className="text-2xl font-bold text-white">{Math.round(calculateBMR())}</p>
            <p className="text-slate-500 text-xs">kcal/day</p>
          </div>
          <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
            <p className="text-slate-400 text-xs mb-1">TDEE</p>
            <p className="text-2xl font-bold text-white">{calculateTDEE()}</p>
            <p className="text-slate-500 text-xs">kcal/day</p>
          </div>
          <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
            <p className="text-slate-400 text-xs mb-1">Daily Target</p>
            <p className="text-2xl font-bold text-cyan-400">{calculateTargetCalories()}</p>
            <p className="text-slate-500 text-xs">kcal ({GOAL_MODIFIERS[profile.goal].label})</p>
          </div>
          <div className="bg-slate-900 rounded-xl p-4 border border-slate-800">
            <p className="text-slate-400 text-xs mb-1">Water Goal</p>
            <p className="text-2xl font-bold text-blue-400">{(calculateWaterGoal() / 1000).toFixed(1)}L</p>
            <p className="text-slate-500 text-xs">per day</p>
          </div>
        </div>
      )}

      {/* Current Split */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold">Workout Split</h3>
            <button 
              onClick={() => setShowSplitModal(true)}
              className="text-cyan-400 text-sm font-medium"
            >
              Change
            </button>
          </div>
        </div>
        
        {activeSplit ? (
          <div className="p-4 space-y-2">
            <div className="flex items-center justify-between mb-3">
              <p className="text-white font-medium">{activeSplit.name}</p>
              {activeSplit.isCustom && (
                <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 text-xs rounded-full">
                  Custom
                </span>
              )}
            </div>
            {DAYS.map((day, idx) => {
              const splitDay = activeSplit.days.find(d => d.dayOfWeek === idx);
              return (
                <div 
                  key={day} 
                  className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0"
                >
                  <span className="text-slate-400 text-sm">{day}</span>
                  <span className="text-white text-sm">{splitDay?.label || 'Rest'}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-slate-400 mb-3">No split selected</p>
            <button
              onClick={() => setShowSplitModal(true)}
              className="px-4 py-2 bg-cyan-500 text-white rounded-lg font-medium"
            >
              Select Split
            </button>
          </div>
        )}
      </div>

      {/* Custom Splits */}
      {customSplits.length > 0 && (
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
          <h3 className="text-white font-semibold mb-3">My Custom Splits</h3>
          <div className="space-y-2">
            {customSplits.map((split) => (
              <div 
                key={split.id}
                className="flex items-center justify-between bg-slate-800/50 rounded-lg p-3 border border-slate-700"
              >
                <span className="text-white">{split.name}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveSplit(split)}
                    className={cn(
                      "px-3 py-1 rounded text-sm",
                      activeSplit?.id === split.id
                        ? "bg-cyan-500 text-white"
                        : "bg-slate-700 text-slate-300"
                    )}
                  >
                    {activeSplit?.id === split.id ? 'Active' : 'Use'}
                  </button>
                  <button
                    onClick={() => deleteCustomSplit(split.id)}
                    className="text-slate-400 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Custom Split Button */}
      <button
        onClick={() => setShowCustomSplitModal(true)}
        className="w-full py-4 rounded-xl bg-slate-900 border border-dashed border-slate-700 text-slate-400 flex items-center justify-center gap-2 hover:border-cyan-500/50 hover:text-cyan-400 transition-colors"
      >
        <Plus className="w-5 h-5" />
        Create Custom Split
      </button>

      {/* Profile Modal */}
      {showProfileModal && (
        <ProfileModal 
          profile={profile}
          onClose={() => setShowProfileModal(false)}
          onSave={(p) => {
            setProfile(p);
            setShowProfileModal(false);
          }}
        />
      )}

      {/* Split Selection Modal */}
      {showSplitModal && (
        <SplitModal
          splits={allSplits}
          activeSplit={activeSplit}
          onClose={() => setShowSplitModal(false)}
          onSelect={(split) => {
            setActiveSplit(split);
            setShowSplitModal(false);
          }}
        />
      )}

      {/* Custom Split Modal */}
      {showCustomSplitModal && (
        <CustomSplitModal
          onClose={() => setShowCustomSplitModal(false)}
          onSave={(split) => {
            addCustomSplit(split);
            setActiveSplit(split);
            setShowCustomSplitModal(false);
          }}
        />
      )}
    </div>
  );
}

interface ProfileModalProps {
  profile: UserProfile | null;
  onClose: () => void;
  onSave: (profile: UserProfile) => void;
}

function ProfileModal({ profile, onClose, onSave }: ProfileModalProps) {
  const [form, setForm] = useState<UserProfile>(profile || {
    name: '',
    username: '',
    bio: '',
    height: 175,
    weight: 70,
    startingWeight: 70,
    goalWeight: 70,
    age: 25,
    gender: 'male',
    activityLevel: 'moderate',
    goal: 'maintain',
    privacy: {
      showWorkouts: true,
      showNutrition: true,
      showPhotos: false,
      showStats: true,
    },
  });

  // Initialize starting weight if not set
  if (!form.startingWeight) {
    form.startingWeight = form.weight;
  }

  const handleSubmit = () => {
    if (form.name.trim()) {
      onSave(form);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 w-full max-w-lg rounded-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <h3 className="text-white text-lg font-semibold">Edit Profile</h3>
          {profile && (
            <button onClick={onClose} className="text-slate-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          )}
        </div>
        
        <div className="flex-1 overflow-auto p-4 space-y-4">
          <div>
            <label className="text-slate-400 text-sm mb-1 block">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your name"
              className="w-full bg-slate-800 text-white px-4 py-3 rounded-xl border border-slate-700 focus:border-cyan-500 focus:outline-none"
            />
          </div>
          
          <div>
            <label className="text-slate-400 text-sm mb-1 block">Username (for social features)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">@</span>
              <input
                type="text"
                value={form.username || ''}
                onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })}
                placeholder="username"
                className="w-full bg-slate-800 text-white pl-8 pr-4 py-3 rounded-xl border border-slate-700 focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <p className="text-slate-500 text-xs mt-1">Others can find you by this username</p>
          </div>
          
          <div>
            <label className="text-slate-400 text-sm mb-1 block">Bio (optional)</label>
            <textarea
              value={form.bio || ''}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder="Tell others about your fitness journey..."
              className="w-full bg-slate-800 text-white px-4 py-3 rounded-xl border border-slate-700 focus:border-cyan-500 focus:outline-none resize-none h-20"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 text-sm mb-1 block">Height (cm)</label>
              <input
                type="number"
                value={form.height}
                onChange={(e) => setForm({ ...form, height: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-800 text-white px-4 py-3 rounded-xl border border-slate-700 focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-slate-400 text-sm mb-1 block">Current Weight (kg)</label>
              <input
                type="number"
                value={form.weight}
                onChange={(e) => setForm({ ...form, weight: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-800 text-white px-4 py-3 rounded-xl border border-slate-700 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 text-sm mb-1 block">Starting Weight (kg)</label>
              <input
                type="number"
                value={form.startingWeight || form.weight}
                onChange={(e) => setForm({ ...form, startingWeight: parseFloat(e.target.value) || 0 })}
                placeholder="When you started"
                className="w-full bg-slate-800 text-white px-4 py-3 rounded-xl border border-slate-700 focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-slate-400 text-sm mb-1 block">Goal Weight (kg)</label>
              <input
                type="number"
                value={form.goalWeight || form.weight}
                onChange={(e) => setForm({ ...form, goalWeight: parseFloat(e.target.value) || 0 })}
                placeholder="Your target"
                className="w-full bg-slate-800 text-white px-4 py-3 rounded-xl border border-slate-700 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 text-sm mb-1 block">Age</label>
              <input
                type="number"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-800 text-white px-4 py-3 rounded-xl border border-slate-700 focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-slate-400 text-sm mb-1 block">Gender</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setForm({ ...form, gender: 'male' })}
                  className={cn(
                    "flex-1 py-3 rounded-xl font-medium transition-colors",
                    form.gender === 'male'
                      ? "bg-cyan-500 text-white"
                      : "bg-slate-800 text-slate-400"
                  )}
                >
                  Male
                </button>
                <button
                  onClick={() => setForm({ ...form, gender: 'female' })}
                  className={cn(
                    "flex-1 py-3 rounded-xl font-medium transition-colors",
                    form.gender === 'female'
                      ? "bg-cyan-500 text-white"
                      : "bg-slate-800 text-slate-400"
                  )}
                >
                  Female
                </button>
              </div>
            </div>
          </div>
          
          <div>
            <label className="text-slate-400 text-sm mb-2 block">Activity Level</label>
            <div className="space-y-2">
              {Object.entries(ACTIVITY_MULTIPLIERS).map(([key, { label }]) => (
                <button
                  key={key}
                  onClick={() => setForm({ ...form, activityLevel: key as UserProfile['activityLevel'] })}
                  className={cn(
                    "w-full text-left p-3 rounded-lg border transition-colors",
                    form.activityLevel === key
                      ? "bg-cyan-500/10 border-cyan-500 text-white"
                      : "bg-slate-800 border-slate-700 text-slate-400"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="text-slate-400 text-sm mb-2 block">Goal</label>
            <div className="space-y-2">
              {Object.entries(GOAL_MODIFIERS).map(([key, { label, modifier }]) => (
                <button
                  key={key}
                  onClick={() => setForm({ ...form, goal: key as UserProfile['goal'] })}
                  className={cn(
                    "w-full text-left p-3 rounded-lg border transition-colors flex justify-between items-center",
                    form.goal === key
                      ? "bg-cyan-500/10 border-cyan-500 text-white"
                      : "bg-slate-800 border-slate-700 text-slate-400"
                  )}
                >
                  <span>{label}</span>
                  <span className={cn(
                    "text-sm",
                    modifier < 0 ? "text-red-400" : modifier > 0 ? "text-green-400" : "text-slate-500"
                  )}>
                    {modifier > 0 ? '+' : ''}{modifier} kcal
                  </span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Privacy Settings */}
          <div>
            <label className="text-slate-400 text-sm mb-2 block">Privacy Settings</label>
            <p className="text-slate-500 text-xs mb-3">Control what others can see when they view your profile</p>
            <div className="space-y-2">
              {[
                { key: 'showStats', label: 'Show my stats', desc: 'Workout count, streaks, volume' },
                { key: 'showWorkouts', label: 'Show my workouts', desc: 'Exercise logs and progress' },
                { key: 'showNutrition', label: 'Show my nutrition', desc: 'Meal logs and macros' },
                { key: 'showPhotos', label: 'Show my photos', desc: 'Progress pictures' },
              ].map(({ key, label, desc }) => (
                <button
                  key={key}
                  onClick={() => setForm({
                    ...form,
                    privacy: {
                      ...form.privacy || { showWorkouts: true, showNutrition: true, showPhotos: false, showStats: true },
                      [key]: !(form.privacy?.[key as keyof typeof form.privacy] ?? true)
                    }
                  })}
                  className={cn(
                    "w-full text-left p-3 rounded-lg border transition-colors flex justify-between items-center",
                    form.privacy?.[key as keyof typeof form.privacy] ?? true
                      ? "bg-green-500/10 border-green-500/30 text-white"
                      : "bg-slate-800 border-slate-700 text-slate-400"
                  )}
                >
                  <div>
                    <p className="font-medium">{label}</p>
                    <p className="text-xs text-slate-500">{desc}</p>
                  </div>
                  <div className={cn(
                    "w-10 h-6 rounded-full transition-colors relative",
                    form.privacy?.[key as keyof typeof form.privacy] ?? true
                      ? "bg-green-500"
                      : "bg-slate-600"
                  )}>
                    <div className={cn(
                      "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                      form.privacy?.[key as keyof typeof form.privacy] ?? true
                        ? "right-1"
                        : "left-1"
                    )} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-slate-800 shrink-0 bg-slate-900">
          <button
            onClick={handleSubmit}
            disabled={!form.name.trim()}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg shadow-lg shadow-cyan-500/25 disabled:opacity-50"
          >
            💾 Save Profile
          </button>
        </div>
      </div>
    </div>
  );
}

interface SplitModalProps {
  splits: Split[];
  activeSplit: Split | null;
  onClose: () => void;
  onSelect: (split: Split) => void;
}

function SplitModal({ splits, activeSplit, onClose, onSelect }: SplitModalProps) {
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-end justify-center">
      <div className="bg-slate-900 w-full max-w-lg rounded-t-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-white text-lg font-semibold">Choose Split</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex-1 overflow-auto p-4 space-y-2">
          {splits.map((split) => (
            <button
              key={split.id}
              onClick={() => onSelect(split)}
              className={cn(
                "w-full text-left p-4 rounded-xl border transition-colors",
                activeSplit?.id === split.id
                  ? "bg-cyan-500/10 border-cyan-500"
                  : "bg-slate-800/50 border-slate-700 hover:border-slate-600"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">{split.name}</span>
                {activeSplit?.id === split.id && (
                  <Check className="w-5 h-5 text-cyan-400" />
                )}
              </div>
              <div className="flex flex-wrap gap-1">
                {split.days.slice(0, 7).map((day, idx) => (
                  <span 
                    key={idx}
                    className={cn(
                      "px-2 py-0.5 rounded text-xs",
                      day.muscleGroups.includes('Rest')
                        ? "bg-slate-700 text-slate-400"
                        : "bg-cyan-500/10 text-cyan-400"
                    )}
                  >
                    {DAYS[day.dayOfWeek].slice(0, 3)}: {day.label}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

interface CustomSplitModalProps {
  onClose: () => void;
  onSave: (split: Split) => void;
}

function CustomSplitModal({ onClose, onSave }: CustomSplitModalProps) {
  const [name, setName] = useState('');
  const [days, setDays] = useState<SplitDay[]>(
    DAYS.map((_, idx) => ({
      dayOfWeek: idx,
      muscleGroups: ['Rest'],
      label: 'Rest Day',
    }))
  );
  const [editingDay, setEditingDay] = useState<number | null>(null);

  const handleSave = () => {
    if (name.trim()) {
      onSave({
        id: `custom-${Date.now()}`,
        name: name.trim(),
        days,
        isCustom: true,
      });
    }
  };

  const updateDay = (dayIdx: number, muscleGroups: string[]) => {
    const newDays = [...days];
    const isRest = muscleGroups.includes('Rest') || muscleGroups.length === 0;
    newDays[dayIdx] = {
      dayOfWeek: dayIdx,
      muscleGroups: isRest ? ['Rest'] : muscleGroups,
      label: isRest ? 'Rest Day' : muscleGroups.join(' & '),
    };
    setDays(newDays);
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-end justify-center">
      <div className="bg-slate-900 w-full max-w-lg rounded-t-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-white text-lg font-semibold">Create Custom Split</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex-1 overflow-auto p-4 space-y-4">
          <div>
            <label className="text-slate-400 text-sm mb-1 block">Split Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Custom Split"
              className="w-full bg-slate-800 text-white px-4 py-3 rounded-xl border border-slate-700 focus:border-cyan-500 focus:outline-none"
            />
          </div>
          
          <div className="space-y-2">
            {DAYS.map((day, idx) => (
              <div key={day}>
                <button
                  onClick={() => setEditingDay(editingDay === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700"
                >
                  <span className="text-white">{day}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-sm">{days[idx].label}</span>
                    <ChevronRight className={cn(
                      "w-4 h-4 text-slate-400 transition-transform",
                      editingDay === idx && "rotate-90"
                    )} />
                  </div>
                </button>
                
                {editingDay === idx && (
                  <div className="mt-2 p-3 bg-slate-800 rounded-lg space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {MUSCLE_GROUPS.map((muscle) => {
                        const isSelected = days[idx].muscleGroups.includes(muscle);
                        const isRest = muscle === 'Rest';
                        
                        return (
                          <button
                            key={muscle}
                            onClick={() => {
                              if (isRest) {
                                updateDay(idx, ['Rest']);
                              } else {
                                const current = days[idx].muscleGroups.filter(m => m !== 'Rest');
                                if (isSelected) {
                                  updateDay(idx, current.filter(m => m !== muscle));
                                } else {
                                  updateDay(idx, [...current, muscle]);
                                }
                              }
                            }}
                            className={cn(
                              "px-3 py-1.5 rounded-full text-sm transition-colors",
                              isSelected
                                ? isRest 
                                  ? "bg-slate-600 text-white"
                                  : "bg-cyan-500 text-white"
                                : "bg-slate-700 text-slate-400 hover:text-white"
                            )}
                          >
                            {muscle}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium disabled:opacity-50"
          >
            Create Split
          </button>
        </div>
      </div>
    </div>
  );
}
