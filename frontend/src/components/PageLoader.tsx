export default function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#050505' }}>
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-10 h-10 rounded-full border-2 border-transparent"
          style={{
            borderTopColor: 'var(--accent-indigo-light)',
            borderRightColor: 'var(--accent-indigo)',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Yuklanmoqda…</span>
      </div>
    </div>
  );
}
