type LogType = 'info' | 'warn' | 'error';

export default function (message: string, type: LogType = 'info') {
    const date = new Date();

    const time = `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    const dateSlice = `${pad(date.getDate())}.${pad(date.getMonth())}.${date.getFullYear().toString().slice(2)}`

    console.log(`[${time}] [${dateSlice}] [${type.toUpperCase()}] -> ${message}`);
}

function pad(num: number): string {
    return num.toString().padStart(2, '0');
}
