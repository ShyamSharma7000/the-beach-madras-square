import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-6 text-center">
      <div>
        <h1 className="display text-6xl">That page isn&rsquo;t here</h1>
        <p className="mt-4 text-foam/85">The link may be old or mistyped.</p>
        <Link href="/" className="btn btn-primary mt-8">
          Back to The Beach
        </Link>
      </div>
    </main>
  );
}
