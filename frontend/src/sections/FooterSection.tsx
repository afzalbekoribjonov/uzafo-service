export default function FooterSection() {
  return (
    <footer
      id="boglanish"
      className="w-full py-8 px-6 flex flex-col sm:flex-row items-center justify-between gap-4"
      style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
    >
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
        &copy; 2024 Uzafo.uz. Barcha huquqlar himoyalangan.
      </p>
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
        Afzalbek Oribjonov
      </p>
    </footer>
  );
}
