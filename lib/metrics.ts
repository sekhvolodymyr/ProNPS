export type ReviewMetricInput = {
  rating: number;
  createdAt: Date;
};

export function calculateMetrics(reviews: ReviewMetricInput[], now = new Date()) {
  const total = reviews.length;
  const average = total ? reviews.reduce((sum, review) => sum + review.rating, 0) / total : 0;
  const positive = reviews.filter((review) => review.rating === 5).length;
  const passive = reviews.filter((review) => review.rating === 4).length;
  const negative = reviews.filter((review) => review.rating <= 3).length;
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const negativeLast7Days = reviews.filter(
    (review) => review.rating <= 3 && review.createdAt >= sevenDaysAgo,
  ).length;

  const positivePercent = total ? Math.round((positive / total) * 100) : 0;
  const negativePercent = total ? Math.round((negative / total) * 100) : 0;
  const passivePercent = total ? Math.round((passive / total) * 100) : 0;
  const loyaltyScore = positivePercent - negativePercent;

  return {
    total,
    average,
    positive,
    passive,
    negative,
    positivePercent,
    passivePercent,
    negativePercent,
    loyaltyScore,
    negativeLast7Days,
  };
}

export function buildDailySeries(reviews: ReviewMetricInput[], days = 30, now = new Date()) {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (days - 1));

  return Array.from({ length: days }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    const next = new Date(day);
    next.setDate(day.getDate() + 1);
    const dayReviews = reviews.filter((review) => review.createdAt >= day && review.createdAt < next);
    const average = dayReviews.length
      ? dayReviews.reduce((sum, review) => sum + review.rating, 0) / dayReviews.length
      : 0;

    return {
      label: day.toLocaleDateString("uk-UA", { day: "2-digit", month: "2-digit" }),
      count: dayReviews.length,
      average,
    };
  });
}

