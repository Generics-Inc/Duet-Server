import {Gender} from "@prisma/client";


export class CreateUserDto {
    username: string;
    firstName: string;
    lastName: string;
    gender: Gender;
    birthday: string;
    description?: string;
    photo?: string;
}
