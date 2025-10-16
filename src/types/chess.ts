export type PieceColor = 'white' | 'black';
export type GameMode = '2d' | '3d';
export type PlayMode = 'online' | 'computer' | 'local';
export type GameStatus = 'waiting' | 'active' | 'completed';

export interface Square {
  file: number;
  rank: number;
}

export interface Move {
  from: string;
  to: string;
  piece: string;
  captured?: string;
  promotion?: string;
}

export interface GameSession {
  id: string;
  player1_id: string;
  player2_id?: string;
  status: GameStatus;
  game_mode: string;
  current_turn: PieceColor;
  fen_position: string;
  move_history: Move[];
  winner?: string;
  created_at: string;
  updated_at: string;
}
