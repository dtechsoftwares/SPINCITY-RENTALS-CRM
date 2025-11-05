export const getTodayDateString = (): string => {
    const today = new Date();
    // Vercel/Safari has issues with timezone offsets when splitting ISO string.
    // Manually build the string to ensure YYYY-MM-DD format.
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};
