export default function (timeout: number = 500) {
    return new Promise((resolve) => setTimeout(() => resolve(true), timeout));
}
