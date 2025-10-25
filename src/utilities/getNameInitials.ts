export const getInitials = (
  firstName?: string | null,
  lastName?: string | null
): string => {
  const safeFirst = (firstName ?? "").trim();
  const safeLast = (lastName ?? "").trim();

  if (!safeFirst && !safeLast) return "";

  const firstInitial = safeFirst ? safeFirst.charAt(0).toUpperCase() : "";
  const lastInitial = safeLast ? safeLast.charAt(0).toUpperCase() : "";

  return `${firstInitial}${lastInitial}`;
};

export const getInitialsFromSingleName = (name: string) => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
};
