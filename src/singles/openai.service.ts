import {Injectable} from "@nestjs/common";
import OpenAI from 'openai';
import {ConfigService} from "@nestjs/config";
import {ChatCompletion} from "openai/resources";

type OpenAIResponseType = 'message' | 'full';

@Injectable()
export class OpenaiService extends OpenAI {
    constructor(private configService: ConfigService) {
        super({
            apiKey: configService.get('OPENAI_API_KEY', ''),
            baseURL: 'https://api.proxyapi.ru/openai/v1'
        });
    }

    isOnline() {}

    test() {
        return this.sendGPTContent('Ты кто?');
    }

    private sendGPTContent<R extends OpenAIResponseType = 'message'>(content: string, responseType?: R) {
        return this.chat.completions.create({
            messages: [{ role: 'user', content }],
            model: 'gpt-3.5-turbo',
        })
            .then(r => responseType === 'full' ? r : r.choices[0].message) as Promise<R extends 'full' ? ChatCompletion : string>;
    }
}
