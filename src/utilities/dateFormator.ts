export const formatDate = (dateString?: string) => {
  if (!dateString || typeof dateString !== "string") {
    console.error("Invalid or missing date string:", dateString);
    return "Invalid Date";
  }

  const cleanString = dateString.replace(/^"|"$/g, ""); // remove extra quotes
  const date = new Date(cleanString);

  if (isNaN(date.getTime())) {
    console.error("Could not parse date:", cleanString);
    return "Invalid Date";
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
