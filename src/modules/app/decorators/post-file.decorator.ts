import {applyDecorators, Post, UseInterceptors} from "@nestjs/common";
import {FileInterceptor} from "@nestjs/platform-express";

export const PostFile = ((data?: string) => {
    return applyDecorators(
        Post(data),
        UseInterceptors(FileInterceptor('file'))
    );
});
