import Link from 'next/link';

export default function LoginButton() {
  return (
    <Link href="/api/auth/steam-login">
      <button>Login with Steam</button>
    </Link>
  );
}