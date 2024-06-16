import axios from 'axios';

export default async function (url: string): Promise<Buffer> {
    try {
        return await axios({
            method: 'GET',
            url: url,
            responseType: 'arraybuffer'
        }).then(r => Buffer.from(r.data));
    } catch (e) {
        throw new Error(`Ошибка загрузки файла [${e.message}]`);
    }
}
