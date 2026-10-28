export function BrandMark({ className = "" }: { className?: string }) {
  return <img className={`brand-logo ${className}`} src="/images/brand-art/logo.webp" width="40" height="40" alt="" aria-hidden="true" decoding="async" />;
}
export function Brand({ footer = false }: { footer?: boolean }) {
  return (
    <a
      href="#home"
      className={`brand ${footer ? "brand-footer" : ""}`}
      aria-label="ARCHVANTA — Home"
    >
      <BrandMark />
      <span>ARCHVANTA</span>
    </a>
  );
}
