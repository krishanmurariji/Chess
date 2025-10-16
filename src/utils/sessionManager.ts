export function getOrCreateSessionId(): string {
  const SESSION_KEY = 'chess_session_id';
  let sessionId = localStorage.getItem(SESSION_KEY);

  if (!sessionId) {
    sessionId = `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(SESSION_KEY, sessionId);
  }

  return sessionId;
}

export function clearSessionId(): void {
  localStorage.removeItem('chess_session_id');
}
