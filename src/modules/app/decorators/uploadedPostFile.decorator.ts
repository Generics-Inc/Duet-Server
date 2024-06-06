import {createParamDecorator, ExecutionContext, FileTypeValidator, MaxFileSizeValidator, ParseFilePipe } from "@nestjs/common";
import {ExceptionGenerator} from "@root/errors";
import {utils} from "@root/helpers";
import {validateOrReject} from "class-validator";
import {ClassConstructor, plainToClass} from "class-transformer";


export type UploadedPostFileConfig<BT extends ClassConstructor<unknown>> = {
    fileSize: number;
    fileType: string | RegExp;
    bodyType?: BT;
};
export type UploadedPostFileReturn<T = {}> = {
    params: { [name: string]: any };
    file?: Express.Multer.File;
    body: Omit<T, 'file'>;
};

function isDate(date: any) {
    return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(date.toString());
}
function isObject(date: any) {
    return /^[\[{](.|\s)*[\]}]$/.test(date.toString());
}
function isNumber(date: any) {
    return /^-?\d+(\.\d+)?$/.test(date.toString());
}
function isBoolean(date: any) {
    return /^(true|false)$/.test(date.toString());
}
function isText(date: any) {
    return /^".*"$/.test(date.toString());
}

function getChildrenConstraints(children: any[], ctx = '') {
    const errors: string[] = [];

    for (let child of children) {
        if (child.children) errors.push(...getChildrenConstraints(child.children, ctx + `[${child.property}]`))
        if (child.constraints) errors.push(...Object.values(child.constraints).map(c => ctx + c));
    }

    return errors;
}

export const UploadedPostFile = createParamDecorator(async <BT extends ClassConstructor<unknown>>(config: UploadedPostFileConfig<BT>, ctx: ExecutionContext): Promise<UploadedPostFileReturn<BT>> => {
    const { trimStr } = utils();
    const req = ctx.switchToHttp().getRequest();
    const params = req.params;
    const body = req.body;
    const file = req.file as Express.Multer.File;

    await new ParseFilePipe({
        validators: [
            new MaxFileSizeValidator({ maxSize: config.fileSize, message: `Максимальный размер файла ${config.fileSize} байт` }),
            new FileTypeValidator({ fileType: config.fileType })
        ],
        fileIsRequired: false
    }).transform(file);

    if (config.bodyType) {
        for (let key of Object.keys(body)) {
            try {
                if (isObject(body[key])) body[key] = JSON.parse(body[key]);
                else if (isDate(body[key])) body[key] = new Date(body[key]);
                else if (isNumber(body[key])) body[key] = Number.parseFloat(body[key]);
                else if (isBoolean(body[key])) body[key] = body[key] === 'true';
                else if (isText(body[key])) body[key] = trimStr(body[key], '"');
                else body[key];
            } catch (e) {}
        }

        const classObject = plainToClass(config.bodyType, body)

        try {
            await validateOrReject(classObject as object)
        } catch (e) {
            throw new ExceptionGenerator(400, 0, ...getChildrenConstraints(e));
        }
    }

    return {
        params,
        file,
        body
    };
});
