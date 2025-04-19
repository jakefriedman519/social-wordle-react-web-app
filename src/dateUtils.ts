const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // getMonth() is 0-based
  const day = date.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatDateUTC = (date: Date) => {
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // getUTCMonth() is zero-based
  const day = String(date.getUTCDate()).padStart(2, "0");
  const year = date.getUTCFullYear();
  return `${month}/${day}/${year}`;
};

export { formatDate, formatDateUTC };
