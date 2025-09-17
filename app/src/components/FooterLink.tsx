export function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-slate-300 opacity-[0.72] transition-opacity hover:opacity-100"
    >
      {label}
    </a>
  );
}
