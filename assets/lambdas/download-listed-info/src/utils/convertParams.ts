import { weeksAgo } from './weeksAgo';

interface DateProps {
    date: string;
}

interface MultipleEnteredDateProps {
    inputArray: Array<DateProps>;
}

export const convertParams = (event: MultipleEnteredDateProps | DateProps | { [key: string]: string; }): string[] => {
    const result: string[] = [];

    if ('inputArray' in event) {
        for (const v of event.inputArray) {
            const casted = v as DateProps;
            result.push(casted.date);
        }
    } else if ('date' in event) {
        result.push(event.date);
    } else {
        result.push(weeksAgo(12));
    }

    return result;
}
