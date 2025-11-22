/**
 * date formatting
 * @example
 * formatDate(new Date(), "yyyyMMdd")          -> 20250123
 * formatDate(new Date(), "dd_MM_yyyy")        -> 23_01_2025
 * formatDate(new Date(), "yyyy-MM-dd HH:mm")  -> 2025-01-23 14:08
 * formatDate(new Date(), "HH-mm-ss")          -> 14-08-55
 * @returns formatted string date
 */
const formatDate = (date: Date, format: string): string => {
    const map: Record<string, string> = {
        yyyy: date.getFullYear().toString(),
        MM: String(date.getMonth() + 1).padStart(2, '0'),
        dd: String(date.getDate()).padStart(2, '0'),
        HH: String(date.getHours()).padStart(2, '0'),
        mm: String(date.getMinutes()).padStart(2, '0'),
        ss: String(date.getSeconds()).padStart(2, '0'),
    };

    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, (key) => map[key] ?? '');
};

export default { formatDate };
