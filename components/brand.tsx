import Link from "next/link";

export function Brand() {
  return (
    <Link className="brand" href="/">
      <span className="brand-mark">P</span>
      <span>ProNPS</span>
    </Link>
  );
}

export function CompanyLogo({ name, logoUrl }: { name: string; logoUrl?: string | null }) {
  if (logoUrl) {
    return <img src={logoUrl} alt={`${name} logo`} width={44} height={44} style={{ borderRadius: 8, objectFit: "cover" }} />;
  }

  return <span className="logo-fallback">{name.slice(0, 2).toUpperCase()}</span>;
}

