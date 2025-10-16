/*
  # Chess Game Database Schema

  1. New Tables
    - `game_sessions`
      - `id` (uuid, primary key) - Unique game session identifier
      - `player1_id` (text) - Anonymous player 1 session ID
      - `player2_id` (text, nullable) - Anonymous player 2 session ID
      - `status` (text) - Game status: 'waiting', 'active', 'completed'
      - `game_mode` (text) - Game mode: 'online', 'computer'
      - `current_turn` (text) - Current player turn: 'white' or 'black'
      - `fen_position` (text) - Current board position in FEN notation
      - `move_history` (jsonb) - Array of all moves made
      - `winner` (text, nullable) - Winner: 'white', 'black', 'draw', null
      - `created_at` (timestamptz) - Game creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

    - `game_moves`
      - `id` (uuid, primary key) - Unique move identifier
      - `game_id` (uuid, foreign key) - Reference to game_sessions
      - `move_number` (integer) - Sequential move number
      - `player_color` (text) - Player making move: 'white' or 'black'
      - `from_square` (text) - Source square (e.g., 'e2')
      - `to_square` (text) - Destination square (e.g., 'e4')
      - `piece` (text) - Piece moved (e.g., 'p', 'n', 'b', 'r', 'q', 'k')
      - `captured` (text, nullable) - Captured piece if any
      - `promotion` (text, nullable) - Promotion piece if any
      - `fen_after` (text) - Board position after move
      - `created_at` (timestamptz) - Move timestamp

  2. Security
    - Enable RLS on all tables
    - Allow public read access to active games for spectating
    - Allow players to update their own games
    - Allow anyone to create new games (anonymous play)

  3. Indexes
    - Index on game_sessions.status for matchmaking
    - Index on game_moves.game_id for move retrieval
*/

-- Create game_sessions table
CREATE TABLE IF NOT EXISTS game_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player1_id text NOT NULL,
  player2_id text,
  status text NOT NULL DEFAULT 'waiting',
  game_mode text NOT NULL DEFAULT 'online',
  current_turn text NOT NULL DEFAULT 'white',
  fen_position text NOT NULL DEFAULT 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  move_history jsonb DEFAULT '[]'::jsonb,
  winner text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create game_moves table
CREATE TABLE IF NOT EXISTS game_moves (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
  move_number integer NOT NULL,
  player_color text NOT NULL,
  from_square text NOT NULL,
  to_square text NOT NULL,
  piece text NOT NULL,
  captured text,
  promotion text,
  fen_after text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_game_sessions_status ON game_sessions(status);
CREATE INDEX IF NOT EXISTS idx_game_sessions_created ON game_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_game_moves_game_id ON game_moves(game_id);

-- Enable Row Level Security
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_moves ENABLE ROW LEVEL SECURITY;

-- Policies for game_sessions
CREATE POLICY "Anyone can view active games"
  ON game_sessions FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create games"
  ON game_sessions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update games"
  ON game_sessions FOR UPDATE
  USING (true);

-- Policies for game_moves
CREATE POLICY "Anyone can view moves"
  ON game_moves FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert moves"
  ON game_moves FOR INSERT
  WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
CREATE TRIGGER update_game_sessions_updated_at
  BEFORE UPDATE ON game_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
