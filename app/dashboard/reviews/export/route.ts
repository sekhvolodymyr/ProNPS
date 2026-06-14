import { NextResponse } from "next/server";
import { requireOwnerCompany } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const { company } = await requireOwnerCompany();
  const reviews = await prisma.review.findMany({ where: { companyId: company.id }, orderBy: { createdAt: "desc" } });
  const rows = [
    ["date", "rating", "comment", "contact", "source", "status"],
    ...reviews.map((review) => [
      review.createdAt.toISOString(),
      String(review.rating),
      review.comment,
      review.contact ?? "",
      review.source ?? "",
      review.status,
    ]),
  ];
  const csv = rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")).join("\n");

  return new NextResponse(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="${company.slug}-reviews.csv"`,
    },
  });
}

