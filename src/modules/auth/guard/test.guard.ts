import {CanActivate, Injectable} from "@nestjs/common";

@Injectable()
export class TestGuard implements CanActivate {
    async canActivate(): Promise<boolean> {
        console.log(123)
        return true;
    }
}
