import { useState, useEffect } from 'react';
import { Chess } from 'chess.js';

interface ChessBoard2DProps {
  chess: Chess;
  onMove: (from: string, to: string) => void;
  playerColor: 'white' | 'black';
  flipped: boolean;
}

const pieceUnicode: { [key: string]: string } = {
  wP: '♙', wN: '♘', wB: '♗', wR: '♖', wQ: '♕', wK: '♔',
  bP: '♟', bN: '♞', bB: '♝', bR: '♜', bQ: '♛', bK: '♚',
};

export default function ChessBoard2D({ chess, onMove, playerColor, flipped }: ChessBoard2DProps) {
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [legalMoves, setLegalMoves] = useState<string[]>([]);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);

  const board = chess.board();
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  const displayRanks = flipped ? [...ranks].reverse() : ranks;
  const displayFiles = flipped ? [...files].reverse() : files;

  useEffect(() => {
    const history = chess.history({ verbose: true });
    if (history.length > 0) {
      const last = history[history.length - 1];
      setLastMove({ from: last.from, to: last.to });
    }
  }, [chess]);

  const handleSquareClick = (square: string) => {
    if (selectedSquare) {
      if (legalMoves.includes(square)) {
        onMove(selectedSquare, square);
        setSelectedSquare(null);
        setLegalMoves([]);
      } else {
        const moves = chess.moves({ square: square as any, verbose: true });
        if (moves.length > 0) {
          setSelectedSquare(square);
          setLegalMoves(moves.map((m) => m.to));
        } else {
          setSelectedSquare(null);
          setLegalMoves([]);
        }
      }
    } else {
      const moves = chess.moves({ square: square as any, verbose: true });
      if (moves.length > 0) {
        setSelectedSquare(square);
        setLegalMoves(moves.map((m) => m.to));
      }
    }
  };

  const getPiece = (rankIdx: number, fileIdx: number) => {
    const actualRankIdx = flipped ? 7 - rankIdx : rankIdx;
    const actualFileIdx = flipped ? 7 - fileIdx : fileIdx;
    const piece = board[actualRankIdx][actualFileIdx];
    if (!piece) return null;
    const color = piece.color === 'w' ? 'w' : 'b';
    const type = piece.type.toUpperCase();
    return pieceUnicode[`${color}${type}`];
  };

  const getSquareName = (rankIdx: number, fileIdx: number): string => {
    const file = displayFiles[fileIdx];
    const rank = displayRanks[rankIdx];
    return `${file}${rank}`;
  };

  return (
    <div className="relative">
      <div className="grid grid-cols-8 gap-0 shadow-2xl rounded-lg overflow-hidden border-4 border-slate-700">
        {displayRanks.map((rank, rankIdx) =>
          displayFiles.map((file, fileIdx) => {
            const square = getSquareName(rankIdx, fileIdx);
            const isLight = (rankIdx + fileIdx) % 2 === 0;
            const isSelected = selectedSquare === square;
            const isLegalMove = legalMoves.includes(square);
            const isLastMoveSquare = lastMove && (lastMove.from === square || lastMove.to === square);

            return (
              <div
                key={square}
                onClick={() => handleSquareClick(square)}
                className={`
                  aspect-square flex items-center justify-center text-4xl sm:text-5xl cursor-pointer
                  transition-all duration-200 relative
                  ${isLight ? 'bg-amber-100' : 'bg-amber-800'}
                  ${isSelected ? 'ring-4 ring-blue-500 ring-inset' : ''}
                  ${isLastMoveSquare ? 'bg-yellow-400/40' : ''}
                  hover:brightness-110
                `}
              >
                {getPiece(rankIdx, fileIdx)}
                {isLegalMove && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-4 bg-green-500/60 rounded-full"></div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
