import { Sparkles, Cpu, Users, Swords } from 'lucide-react';

interface HomePageProps {
  onPlayOnline: () => void;
  onPlayComputer: () => void;
  onPlayLocal: () => void;
}

export default function HomePage({ onPlayOnline, onPlayComputer, onPlayLocal }: HomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight">
              Play Chess Online
            </h1>
            <p className="text-xl md:text-2xl text-slate-300">
              Instant play. No sign-in needed. 2D & 3D modes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <button
              onClick={onPlayOnline}
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-xl shadow-lg hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 text-lg"
            >
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6" />
                <span>Play Online</span>
              </div>
            </button>

            <button
              onClick={onPlayComputer}
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-semibold rounded-xl shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 text-lg"
            >
              <div className="flex items-center gap-3">
                <Cpu className="w-6 h-6" />
                <span>Play Computer</span>
              </div>
            </button>

            <button
              onClick={onPlayLocal}
              className="group relative px-8 py-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-semibold rounded-xl shadow-lg hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-105 text-lg"
            >
              <div className="flex items-center gap-3">
                <Swords className="w-6 h-6" />
                <span>Local 2-Player</span>
              </div>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 max-w-3xl mx-auto">
            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700">
              <div className="flex justify-center mb-4">
                <Sparkles className="w-10 h-10 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">2D & 3D Modes</h3>
              <p className="text-slate-400 text-sm">
                Switch seamlessly between classic 2D board view and immersive 3D chess experience
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700">
              <div className="flex justify-center mb-4">
                <Users className="w-10 h-10 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Instant Matchmaking</h3>
              <p className="text-slate-400 text-sm">
                Get matched with real players worldwide instantly, no registration required
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700">
              <div className="flex justify-center mb-4">
                <Cpu className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">AI Opponent</h3>
              <p className="text-slate-400 text-sm">
                Practice against a computer opponent or play locally with a friend
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="py-6 text-center text-slate-400 text-sm border-t border-slate-800">
        Play Chess Online – No Sign In Needed
      </footer>
    </div>
  );
}
