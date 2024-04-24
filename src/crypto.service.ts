import {Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import { scryptSync, createCipheriv, createDecipheriv } from 'crypto';

@Injectable()
export class CryptoService {
    private readonly algorithm = 'aes-256-cbc';
    private readonly key: Buffer;
    private readonly iv: Buffer = Buffer.alloc(16, 0);

    constructor(private configService: ConfigService) {
        this.key = scryptSync(configService.get('CRYPTO_SECRET', ''), 'salt', 32);
    }

    encrypt(text: string): string {
        const cipher = createCipheriv(this.algorithm, this.key, this.iv);
        const encrypted = cipher.update(text, 'utf8', 'hex');
        return encrypted + cipher.final('hex');
    }
    decrypt(text: string): string {
        const decipher = createDecipheriv(this.algorithm, this.key, this.iv);
        const decrypted = decipher.update(text, 'hex', 'utf8');
        return decrypted + decipher.final('utf8');
    }
}
