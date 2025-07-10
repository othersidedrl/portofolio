export default function NotAuthorizedPage() {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[hsl(var(--color-background))] text-[hsl(var(--color-text))]">
        <h1 className="text-4xl font-semibold mb-4">⛔ Access Denied</h1>
        <p className="text-lg text-[hsl(var(--color-muted))]">You are not authorized to view this page.</p>
      </div>
    )
  }
  