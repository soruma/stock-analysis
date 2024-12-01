import { format } from 'date-fns';

/**
 * return the date of the <num> week ago as a string
 * @param num num weeks ago
 * @returns 'yyyy-MM-dd'
 */
export const weeksAgo = (num: number): string => {
    const today = new Date();
    const weeksAgo = new Date(today);
    weeksAgo.setDate(today.getDate() - num * 7);
    const dateOnly = format(weeksAgo, 'yyyy-MM-dd');

    return dateOnly;
};
