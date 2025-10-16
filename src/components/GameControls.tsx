import { RotateCcw, Undo, FlipVertical, Box, Grid3x3, Moon, Sun, Home } from 'lucide-react';
import { GameMode } from '../types/chess';

interface GameControlsProps {
  gameMode: GameMode;
  onToggleMode: () => void;
  onRestart: () => void;
  onUndo: () => void;
  onFlip: () => void;
  onHome: () => void;
  canUndo: boolean;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  currentTurn: 'white' | 'black';
  status?: string;
}

export default function GameControls({
  gameMode,
  onToggleMode,
  onRestart,
  onUndo,
  onFlip,
  onHome,
  canUndo,
  theme,
  onToggleTheme,
  currentTurn,
  status,
}: GameControlsProps) {
  return (
    <div className="bg-slate-800 dark:bg-slate-900 rounded-xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Game Controls</h2>
        <button
          onClick={onToggleTheme}
          className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5 text-slate-300" />
          ) : (
            <Sun className="w-5 h-5 text-yellow-400" />
          )}
        </button>
      </div>

      <div className="bg-slate-700/50 rounded-lg p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Current Turn:</span>
          <span className={`font-semibold ${currentTurn === 'white' ? 'text-white' : 'text-slate-300'}`}>
            {currentTurn.charAt(0).toUpperCase() + currentTurn.slice(1)}
          </span>
        </div>
        {status && (
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Status:</span>
            <span className="font-semibold text-green-400">{status}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onToggleMode}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium"
        >
          {gameMode === '2d' ? (
            <>
              <Box className="w-5 h-5" />
              <span>3D Mode</span>
            </>
          ) : (
            <>
              <Grid3x3 className="w-5 h-5" />
              <span>2D Mode</span>
            </>
          )}
        </button>

        <button
          onClick={onFlip}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors font-medium"
        >
          <FlipVertical className="w-5 h-5" />
          <span>Flip</span>
        </button>

        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-yellow-600 hover:bg-yellow-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
        >
          <Undo className="w-5 h-5" />
          <span>Undo</span>
        </button>

        <button
          onClick={onRestart}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors font-medium"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Restart</span>
        </button>
      </div>

      <button
        onClick={onHome}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors font-medium"
      >
        <Home className="w-5 h-5" />
        <span>Back to Home</span>
      </button>
    </div>
  );
}
