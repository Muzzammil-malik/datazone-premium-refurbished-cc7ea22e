export function BrandMarquee() {
  const brands = ["HP", "DELL", "ACER", "LENOVO", "ASUS", "HCL", "WIPRO", "INTEL", "NVIDIA", "AMD", "MICROSOFT", "APPLE"];
  return (
    <div className="relative overflow-hidden hairline border-x-0 py-8">
      <div className="flex gap-16 animate-[marquee_40s_linear_infinite] whitespace-nowrap">
        {[...brands, ...brands, ...brands].map((b, i) => (
          <span key={i} className="text-2xl md:text-3xl font-bold tracking-tight text-ink-soft/60 hover:text-foreground transition">
            {b}
          </span>
        ))}
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-33.333%); } }`}</style>
    </div>
  );
}