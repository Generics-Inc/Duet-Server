import {
    createParamDecorator, ExecutionContext,
    FileTypeValidator,
    MaxFileSizeValidator,
    ParseFilePipe,
} from "@nestjs/common";
import {validateOrReject} from "class-validator";
import {ExceptionGenerator} from "../../errors/ExceptionGenerator";

export type UploadedPostFileConfig<BT> = {
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

export const UploadedPostFile = createParamDecorator(async <BT>(config: UploadedPostFileConfig<BT>, ctx: ExecutionContext): Promise<UploadedPostFileReturn<BT>> => {
    const req = ctx.switchToHttp().getRequest();
    const params = req.params;
    const body = req.body;
    const file = req.file;

    await new ParseFilePipe({
        validators: [
            new MaxFileSizeValidator({ maxSize: config.fileSize, message: `Максимальный размер файла ${config.fileSize} байт` }),
            new FileTypeValidator({ fileType: config.fileType })
        ],
        fileIsRequired: false
    }).transform(file);

    if (config.bodyType) {
        const bodyObject = new (config.bodyType as any)();

        Object.keys(body).forEach(key => bodyObject[key] = isDate(body[key]) ? new Date(body[key]) : body[key]);

        try {
            await validateOrReject(bodyObject)
        } catch (e) {
            throw new ExceptionGenerator(400, 0, ...[].concat(...e.map((t: any) => Object.values(t.constraints))));
        }
    }

    return {
        params,
        file,
        body
    };
});