export default function PrivateFooter() {
  return (
    <footer className="shrink-0 border-t border-white/20 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 text-center text-sm text-slate-500 dark:text-slate-400">
        © {new Date().getFullYear()} Ledgerly · Financial management made
        simple.
      </div>
    </footer>
  );
}
