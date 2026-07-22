import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex items-center gap-3">
          <Image
            src="/next.svg"
            alt="WebOps Platform"
            width={120}
            height={30}
            className="dark:invert"
            priority
          />
          <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">v0.1.0</span>
        </div>

        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight text-black dark:text-zinc-50">
            Deploy, manage, and scale<br />your applications effortlessly.
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            WebOps Platform is your all‑in‑one solution for modern web operations – from CI/CD to monitoring and beyond.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/api/docs"  // you'll expose your Swagger docs here later
              className="inline-flex h-12 items-center justify-center rounded-full bg-black px-6 text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              Explore API
            </Link>
            <Link
              href="/login"
              className="inline-flex h-12 items-center justify-center rounded-full border border-black/10 px-6 transition hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
            >
              Log in
            </Link>
          </div>
        </div>

        <div className="text-sm text-zinc-500 dark:text-zinc-400">
          Built with Next.js, NestJS, Prisma &amp; Redis
        </div>
      </main>
    </div>
  );
}