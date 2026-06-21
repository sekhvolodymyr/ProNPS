import { prisma } from "@/lib/db";

export function slugify(value: string) {
  const translit = value
    .toLowerCase()
    .replace(/[іїєґ]/g, (char) => ({ і: "i", ї: "yi", є: "ye", ґ: "g" })[char] ?? char)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);

  return translit || "company";
}

export async function createUniqueCompanySlug(name: string) {
  const base = slugify(name);
  let candidate = base;
  let suffix = 2;

  while (await prisma.company.findUnique({ where: { slug: candidate }, select: { id: true } })) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}

