import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useStore } from '@/store/useStore';
import { Dumbbell, Mail, Lock, Eye, EyeOff, Loader2, Sparkles, Key, ChevronRight, X } from 'lucide-react';

type AuthStep = 'auth' | 'gemini-setup';

export function AuthScreen({ onAuthSuccess }: { onAuthSuccess: () => void }) {
  const [step, setStep] = useState<AuthStep>('auth');
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [showGeminiKey, setShowGeminiKey] = useState(false);

  const { setGeminiApiKey } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onAuthSuccess();
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        // New signup → ask for Gemini key
        setStep('gemini-setup');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGeminiSave = () => {
    if (geminiKey.trim()) {
      setGeminiApiKey(geminiKey.trim());
    }
    onAuthSuccess();
  };

  const handleGeminiSkip = () => {
    onAuthSuccess();
  };

  if (step === 'gemini-setup') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm">
          {/* Icon */}
          <div className="mb-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-500/30">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Power up with AI</h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              Add your Gemini API key to enable AI-powered food analysis, photo-to-macros, and smart workout logging.
            </p>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-5">
            {/* Key Input */}
            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Gemini API Key
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showGeminiKey ? 'text' : 'password'}
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  placeholder="AIza..."
                  className="w-full bg-slate-800 text-white pl-10 pr-10 py-3 rounded-xl border border-slate-700 focus:border-violet-500 focus:outline-none text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowGeminiKey(!showGeminiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showGeminiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-slate-500 text-xs mt-2">
                Get a free key at{' '}
                <span className="text-violet-400">aistudio.google.com/app/apikey</span>
              </p>
            </div>

            {/* What you get */}
            <div className="bg-violet-500/5 border border-violet-500/20 rounded-xl p-4 space-y-2">
              <p className="text-violet-400 text-xs font-semibold uppercase tracking-wider">With AI enabled</p>
              {[
                'Describe food in plain English → instant macros',
                'Photo of your meal → automatic nutrition analysis',
                'Natural language workout logging',
              ].map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-violet-400 mt-0.5 shrink-0" />
                  <p className="text-slate-300 text-xs">{item}</p>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={handleGeminiSave}
                disabled={!geminiKey.trim()}
                className="w-full bg-gradient-to-r from-violet-500 to-purple-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-40"
              >
                <Sparkles className="w-4 h-4" />
                Enable AI Features
              </button>
              <button
                onClick={handleGeminiSkip}
                className="w-full bg-slate-800 text-slate-400 py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
                Skip for now
              </button>
            </div>
          </div>

          <p className="text-slate-600 text-xs text-center mt-4">
            Your key is stored locally on this device only. You can add or change it later in Profile settings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/20">
          <Dumbbell className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Swift Logger</h1>
        <p className="text-slate-400">Track your fitness journey</p>
      </div>

      {/* Auth Form */}
      <div className="w-full max-w-sm">
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
          <h2 className="text-xl font-semibold text-white mb-6 text-center">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm text-slate-400 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full bg-slate-800 text-white pl-10 pr-4 py-3 rounded-xl border border-slate-700 focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-slate-400 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full bg-slate-800 text-white pl-10 pr-12 py-3 rounded-xl border border-slate-700 focus:border-cyan-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Login/Signup */}
          <div className="mt-6 text-center">
            <p className="text-slate-400">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className="ml-2 text-cyan-400 hover:text-cyan-300 font-medium"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>

        {/* Info */}
        <p className="text-slate-500 text-sm text-center mt-6">
          Your data syncs to the cloud and is safe even if you clear browser history.
        </p>
      </div>
    </div>
  );
}
