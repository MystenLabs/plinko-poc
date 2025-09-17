export function SocialButton({
  href,
  ariaLabel,
  children,
}: {
  href: string;
  ariaLabel: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className="
        inline-flex w-full items-center justify-center gap-3 rounded-full
        bg-[#FFFFFF26] px-5 py-3 text-white ring-1 ring-white/10 transition
        hover:bg-[#FFFFFF33] hover:ring-white/20
        lg:w-auto
      "
    >
      {children}
    </a>
  );
}
