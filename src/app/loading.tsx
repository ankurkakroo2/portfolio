export default function Loading() {
  return (
    <main className="min-h-screen flex items-center justify-center transition-colors duration-300">
      <div className="flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-neutral-400 dark:bg-neutral-500 animate-pulse [animation-delay:0ms]" />
        <span className="h-1.5 w-1.5 rounded-full bg-neutral-400 dark:bg-neutral-500 animate-pulse [animation-delay:300ms]" />
        <span className="h-1.5 w-1.5 rounded-full bg-neutral-400 dark:bg-neutral-500 animate-pulse [animation-delay:600ms]" />
      </div>
    </main>
  );
}
