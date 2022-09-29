export const dateFormat = "dd/MM/yyyy HH:mm";

export function getMinDiff(startDate: Date, endDate: Date) {
  const msInMinute = 60 * 1000;

  return Math.round(
    Math.abs(endDate.getTime() - startDate.getTime()) / msInMinute
  );
}
