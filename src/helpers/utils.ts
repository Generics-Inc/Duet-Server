import {DataNotFoundException, IncorrectIDFormatException, ExceptionGenerator} from "../errors";

type UtilsStructLogClassReturn<T, EX extends (keyof T)[]> = Omit<T, EX[number]>;
type UtilsStructID = string | number;

const symbols: string = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ1234567890";

interface UtilsStruct {
    createRandomString(exclude?: string[], len?: number): string;
    ifEmptyGivesError<D extends any, E extends ExceptionGenerator>(data: D, exception?: E): D;
    checkIdCurrent(id: UtilsStructID): void;
    logClass<T, EX extends (keyof T)[]>(classObject: T, exclude: EX): UtilsStructLogClassReturn<T, EX>;
    arraysEqual(arr1: any[], arr2: any[]): boolean;
    spliceFind<T>(arr: T[], handler: (el: T) => boolean): T[];
    trimStr(str: string, trim: string): string;
    dateToString(date: string): string;
    syncWait(timeout?: number): Promise<true>;
}

class Utils implements UtilsStruct {
    createRandomString(exclude = [], len = 10): string {
        const generateString = () => [...Array(len)]
            .reduce((accum) => [...accum, symbols[Math.floor(Math.random() * symbols.length)]], [])
            .join('');

        let resultString = generateString();
        while (exclude.includes(resultString)) {
            resultString = generateString();
        }

        return resultString;
    }
    ifEmptyGivesError<T extends any>(data: T, exception = DataNotFoundException): T {
        if (!data) throw exception;
        return data;
    }
    checkIdCurrent(id: UtilsStructID): void {
        if (!/^-?[\d.]+(?:e-?\d+)?$/.test(id.toString())) throw IncorrectIDFormatException;
    }
    logClass<T, EX extends (keyof T)[]>(classObject: T, excludes: EX): UtilsStructLogClassReturn<T, EX> {
        const classJSON = { ...classObject };

        for (const exclude of excludes) {
            delete classJSON[exclude];
        }

        return classJSON;
    }
    arraysEqual(arr1: any[], arr2: any[]): boolean {
        return arr1.length === arr2.length && arr1.every((el, i) => el === arr2[i]);
    }
    spliceFind<T>(arr: T[], handler: (el: T) => boolean): T[] {
        const removed: T[] = [];

        for (let elIndex = 0; elIndex < arr.length; ++elIndex) {
            if (handler(arr[elIndex])) {
                removed.push(...arr.splice(elIndex, 1));
                --elIndex;
            }
        }

        return removed;
    }
    trimStr(str: string, trim: string): string {
        if (trim === '') return str;
        return str.replace(new RegExp(`^${trim}+|(${trim}+)$`, 'g'), "");
    }
    dateToString(date: string): string {
        function padNum(num: number, len: number = 2, char: string = '0'): string {
            return num.toString().padStart(len, char);
        }

        const objDate = new Date(date);

        const day = objDate.getDate();
        const month = objDate.getMonth() + 1;
        const year = objDate.getFullYear();

        return `${padNum(day)}.${padNum(month)}.${year}`;
    }

    syncWait(timeout: number = 500) {
        return new Promise<true>((resolve) => setTimeout(() => resolve(true), timeout));
    }
}

const utilsObj = new Utils();
export function utils(): UtilsStruct {
    return utilsObj;
}
