export const normalizeMinutes = ( initialMinutes ) => {
    const hours = Math.trunc( initialMinutes / 60 );
    const minutes = initialMinutes % 60;

    return `${hours}ч ${minutes}м`;
}

export const normalizeFullDate = ( date ) => {
    const minutes = date.getMinutes();
    const hours = date.getHours();
    const days = date.getDate();
    const month = date.getMonth() + 1;

    return {
       minutes: String(minutes).padStart(2, '0'),
       hours: String(hours).padStart(2, '0'),
       days: String(days).padStart(2, '0'),
       month: String(month).padStart(2, '0'),
       year: date.getFullYear(),
    };
};
