import { useState, useEffect, useCallback } from 'react';
import { Chess } from 'chess.js';
import ChessBoard2D from './ChessBoard2D';
import ChessBoard3D from './ChessBoard3D';
import GameControls from './GameControls';
import { GameMode, PlayMode } from '../types/chess';
import { supabase } from '../lib/supabase';
import { getOrCreateSessionId } from '../utils/sessionManager';
import { getBestMove } from '../utils/chessEngine';
import { useTheme } from '../hooks/useTheme';

interface GamePageProps {
  playMode: PlayMode;
  onBackToHome: () => void;
}

export default function GamePage({ playMode, onBackToHome }: GamePageProps) {
  const [chess] = useState(() => new Chess());
  const [gameMode, setGameMode] = useState<GameMode>('2d');
  const [flipped, setFlipped] = useState(false);
  const [playerColor] = useState<'white' | 'black'>('white');
  const [gameId, setGameId] = useState<string | null>(null);
  const [, setUpdateTrigger] = useState(0);
  const [isWaitingForOpponent, setIsWaitingForOpponent] = useState(false);
  const [gameStatus, setGameStatus] = useState<string>('');
  const { theme, toggleTheme } = useTheme();

  const sessionId = getOrCreateSessionId();

  const forceUpdate = () => setUpdateTrigger((prev) => prev + 1);

  const checkGameStatus = useCallback(() => {
    if (chess.isCheckmate()) {
      const winner = chess.turn() === 'w' ? 'Black' : 'White';
      setGameStatus(`Checkmate! ${winner} wins!`);
      return true;
    } else if (chess.isDraw()) {
      setGameStatus('Draw!');
      return true;
    } else if (chess.isStalemate()) {
      setGameStatus('Stalemate!');
      return true;
    } else if (chess.isCheck()) {
      setGameStatus('Check!');
      return false;
    } else {
      setGameStatus('');
      return false;
    }
  }, [chess]);

  const makeComputerMove = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newFen = getBestMove(chess.fen(), 2);
    if (newFen) {
      chess.load(newFen);
      forceUpdate();
      checkGameStatus();
    }
  }, [chess, checkGameStatus]);

  const syncGameState = useCallback(async () => {
    if (!gameId || playMode === 'local' || playMode === 'computer') return;

    try {
      const { data, error } = await supabase
        .from('game_sessions')
        .select('*')
        .eq('id', gameId)
        .maybeSingle();

      if (error) throw error;

      if (data && data.fen_position !== chess.fen()) {
        chess.load(data.fen_position);
        forceUpdate();
        checkGameStatus();
      }
    } catch (error) {
      console.error('Error syncing game state:', error);
    }
  }, [gameId, playMode, chess, checkGameStatus]);

  useEffect(() => {
    const initGame = async () => {
      if (playMode === 'online') {
        try {
          const { data: waitingGame } = await supabase
            .from('game_sessions')
            .select('*')
            .eq('status', 'waiting')
            .is('player2_id', null)
            .neq('player1_id', sessionId)
            .limit(1)
            .maybeSingle();

          if (waitingGame) {
            const { data, error } = await supabase
              .from('game_sessions')
              .update({
                player2_id: sessionId,
                status: 'active',
              })
              .eq('id', waitingGame.id)
              .select()
              .single();

            if (!error && data) {
              setGameId(data.id);
              setGameStatus('Game started!');
            }
          } else {
            const { data, error } = await supabase
              .from('game_sessions')
              .insert({
                player1_id: sessionId,
                status: 'waiting',
                game_mode: 'online',
              })
              .select()
              .single();

            if (!error && data) {
              setGameId(data.id);
              setIsWaitingForOpponent(true);
              setGameStatus('Waiting for opponent...');
            }
          }
        } catch (error) {
          console.error('Error initializing online game:', error);
        }
      }
    };

    initGame();
  }, [playMode, sessionId]);

  useEffect(() => {
    if (!gameId || playMode !== 'online') return;

    const channel = supabase
      .channel(`game:${gameId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'game_sessions',
          filter: `id=eq.${gameId}`,
        },
        (payload) => {
          const newData = payload.new as any;
          if (newData.status === 'active' && isWaitingForOpponent) {
            setIsWaitingForOpponent(false);
            setGameStatus('Opponent found! Game started!');
          }
          syncGameState();
        }
      )
      .subscribe();

    const interval = setInterval(syncGameState, 2000);

    return () => {
      channel.unsubscribe();
      clearInterval(interval);
    };
  }, [gameId, playMode, isWaitingForOpponent, syncGameState]);

  const handleMove = async (from: string, to: string) => {
    try {
      const moves = chess.moves({ verbose: true });
      const move = moves.find((m) => m.from === from && m.to === to);

      if (!move) return;

      chess.move({ from, to, promotion: 'q' });
      forceUpdate();

      const isGameOver = checkGameStatus();

      if (gameId && playMode === 'online') {
        await supabase
          .from('game_sessions')
          .update({
            fen_position: chess.fen(),
            current_turn: chess.turn() === 'w' ? 'white' : 'black',
            status: isGameOver ? 'completed' : 'active',
          })
          .eq('id', gameId);
      }

      if (!isGameOver && playMode === 'computer' && chess.turn() === 'b') {
        makeComputerMove();
      }
    } catch (error) {
      console.error('Error making move:', error);
    }
  };

  const handleRestart = () => {
    chess.reset();
    forceUpdate();
    setGameStatus('');
  };

  const handleUndo = () => {
    if (playMode === 'computer') {
      chess.undo();
      chess.undo();
    } else {
      chess.undo();
    }
    forceUpdate();
    checkGameStatus();
  };

  const handleFlip = () => {
    setFlipped((prev) => !prev);
  };

  const currentTurn = chess.turn() === 'w' ? 'white' : 'black';

  if (isWaitingForOpponent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <h2 className="text-2xl font-bold text-white">Waiting for opponent...</h2>
          <p className="text-slate-400">Please wait while we find you a match</p>
          <button
            onClick={onBackToHome}
            className="mt-4 px-6 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {gameMode === '2d' ? (
              <ChessBoard2D
                chess={chess}
                onMove={handleMove}
                playerColor={playerColor}
                flipped={flipped}
              />
            ) : (
              <ChessBoard3D
                chess={chess}
                onMove={handleMove}
                playerColor={playerColor}
                flipped={flipped}
              />
            )}
          </div>

          <div className="lg:col-span-1">
            <GameControls
              gameMode={gameMode}
              onToggleMode={() => setGameMode((prev) => (prev === '2d' ? '3d' : '2d'))}
              onRestart={handleRestart}
              onUndo={handleUndo}
              onFlip={handleFlip}
              onHome={onBackToHome}
              canUndo={chess.history().length > 0}
              theme={theme}
              onToggleTheme={toggleTheme}
              currentTurn={currentTurn}
              status={gameStatus}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
