import { describe, expect, it } from "vitest";
import { reviewSchema } from "../lib/validation";

describe("reviewSchema", () => {
  it("requires rating and a comment of at least 30 characters", () => {
    const result = reviewSchema.safeParse({ rating: 5, comment: "short" });
    expect(result.success).toBe(false);
  });

  it("allows optional contact", () => {
    const result = reviewSchema.safeParse({
      rating: 4,
      comment: "This is a useful customer comment with enough detail.",
    });
    expect(result.success).toBe(true);
  });
});
