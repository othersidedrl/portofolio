export default function LoadingScreen() {
  return (
    <div className="flex items-center justify-center h-screen w-full bg-[var(--bg-dark)] text-[var(--text-strong)]">
      <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
