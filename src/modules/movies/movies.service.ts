import { Injectable } from '@nestjs/common';
import {MoviesModelService} from "@models/movies/movies.service";
import {HttpService} from "@nestjs/axios";
import {CreateMovieDto} from "@modules/movies/dto";
import {TasksService} from "@modules/tasks/tasks.service";
import {UploadedPostFileReturn} from "@modules/app/decorators";
import {FilesService} from "@modules/files/files.service";

@Injectable()
export class MoviesService {
    constructor(
        private modelService: MoviesModelService,
        private tasksService: TasksService,
        private filesService: FilesService,
        private httpService: HttpService
    ) {}

    getModel() {
        return this.modelService;
    }

    async createMovie(profileId: number, groupId: number, { body, file }: UploadedPostFileReturn<CreateMovieDto>) {
        let movie = await this.modelService.createMovie(profileId, groupId, {
            name: body.name,
            type: body.type,
            rating: body.rating,
            isWatched: body.isWatched,
            description: body.description,
            tags: {
                connectOrCreate: body.tags.map(tag => ({
                    where: {
                        groupId_name: {
                            groupId,
                            name: tag.name
                        }
                    },
                    create: {
                        profile: { connect: { id: profileId } },
                        group: { connect: { id: groupId } },
                        name: tag.name,
                        color: tag.color
                    }
                }))
            },
            ...(body.type === 'FILM' ? {} : {
                seasons: {
                    create: body.seasons.map(season => ({
                        name: season.name,
                        isWatched: body.isWatched,
                        series: {
                            create: season.series.map(seria => ({
                                name: seria.name,
                                isWatched: body.isWatched
                            }))
                        }
                    }))
                }
            })
        });

        if (file) {
            try {
                movie = await this.modelService.updateMoviePhotoById(movie.id, await this.filesService.upload({
                    profileId: profileId,
                    bucketName: 'movie',
                    fileName: 'main',
                    fileDir: movie.id.toString(),
                    file: file.buffer
                }));
            } catch (e) {
                movie = await this.modelService.updateMoviePhotoById(movie.id, 'error');
            }
        } else {
            this.tasksService.sendMessageToXMLParserQueue({
                reqId: movie.id,
                type: 'image',
                text: movie.name
            });
        }

        return movie;
    }
}
