import { Chess } from 'chess.js';

export function makeComputerMove(fen: string): string | null {
  const chess = new Chess(fen);
  const moves = chess.moves();

  if (moves.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * moves.length);
  const move = moves[randomIndex];

  chess.move(move);
  return chess.fen();
}

export function evaluatePosition(chess: Chess): number {
  const pieceValues: { [key: string]: number } = {
    p: 1,
    n: 3,
    b: 3,
    r: 5,
    q: 9,
    k: 0,
  };

  let score = 0;
  const board = chess.board();

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const piece = board[i][j];
      if (piece) {
        const value = pieceValues[piece.type];
        score += piece.color === 'w' ? value : -value;
      }
    }
  }

  return score;
}

export function getBestMove(fen: string, depth: number = 2): string | null {
  const chess = new Chess(fen);
  const moves = chess.moves({ verbose: true });

  if (moves.length === 0) return null;

  let bestMove = moves[0];
  let bestScore = -Infinity;

  for (const move of moves) {
    chess.move(move);
    const score = -minimax(chess, depth - 1, -Infinity, Infinity, false);
    chess.undo();

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  chess.move(bestMove);
  return chess.fen();
}

function minimax(
  chess: Chess,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean
): number {
  if (depth === 0) {
    return evaluatePosition(chess);
  }

  const moves = chess.moves();

  if (moves.length === 0) {
    if (chess.isCheckmate()) {
      return isMaximizing ? -10000 : 10000;
    }
    return 0;
  }

  if (isMaximizing) {
    let maxScore = -Infinity;
    for (const move of moves) {
      chess.move(move);
      const score = minimax(chess, depth - 1, alpha, beta, false);
      chess.undo();
      maxScore = Math.max(maxScore, score);
      alpha = Math.max(alpha, score);
      if (beta <= alpha) break;
    }
    return maxScore;
  } else {
    let minScore = Infinity;
    for (const move of moves) {
      chess.move(move);
      const score = minimax(chess, depth - 1, alpha, beta, true);
      chess.undo();
      minScore = Math.min(minScore, score);
      beta = Math.min(beta, score);
      if (beta <= alpha) break;
    }
    return minScore;
  }
}
