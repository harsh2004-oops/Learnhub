export const loginStudent = async (name: string, rollNumber: string) => {
  const response = await fetch('http://localhost:3001/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, roll_number: rollNumber }),
  });
  if (!response.ok) {
    throw new Error('Login failed');
  }
  return response.json();
};

export const fetchLeaderboard = async () => {
  const response = await fetch('http://localhost:3001/api/leaderboard');
  if (!response.ok) {
    throw new Error('Failed to fetch leaderboard');
  }
  return response.json();
};

