"use client";

export default function Home() {
  const handleLogin = () => {
    window.location.href = '/api/auth/steam';
  };

  return (
    <div>
      <h1>Steam Login Demo</h1>
      <button onClick={handleLogin}>Login with Steam</button>
    </div>
  );
}