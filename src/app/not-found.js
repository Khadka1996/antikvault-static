import Link from 'next/link';

export const metadata = {
  title: 'Page Not Found',
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6 px-4">
        <p className="text-7xl font-bold bg-linear-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
          404
        </p>
        <h1 className="heading-lg">Page Not Found</h1>
        <p className="text-amber-400 max-w-md mx-auto">
          Sorry, the page you&apos;re looking for doesn&apos;t exist. Let&apos;s get you back on
          track.
        </p>
        <Link href="/" className="btn-primary">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
