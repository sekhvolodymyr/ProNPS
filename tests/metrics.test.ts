import { describe, expect, it } from "vitest";
import { calculateMetrics } from "../lib/metrics";

describe("calculateMetrics", () => {
  it("calculates average, rating groups, and loyalty score", () => {
    const now = new Date("2026-06-14T12:00:00Z");
    const reviews = [5, 5, 4, 3, 1].map((rating) => ({ rating, createdAt: now }));

    const metrics = calculateMetrics(reviews, now);

    expect(metrics.total).toBe(5);
    expect(metrics.average).toBe(3.6);
    expect(metrics.positivePercent).toBe(40);
    expect(metrics.negativePercent).toBe(40);
    expect(metrics.passivePercent).toBe(20);
    expect(metrics.loyaltyScore).toBe(0);
    expect(metrics.negativeLast7Days).toBe(2);
  });
});
