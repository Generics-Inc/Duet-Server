import {Injectable} from "@nestjs/common";
import {GroupsMoviesModelService} from "@models/groups/movies/movies.service";
import { utils } from "@root/helpers";
import {MovieNotFoundException, MovieTaskNotFoundException, TaskIsAlreadyRunningConflictException} from "@root/errors";
import {TasksService} from "@modules/tasks/tasks.service";

@Injectable()
export class GroupsMoviesService  {
    private utils = utils();

    constructor(
        private modelService: GroupsMoviesModelService,
        private tasksService: TasksService
    ) {}

    getModel() {
        return this.modelService;
    }

    async getMovieByIdAndGroupId(id: number, groupId: number) {
        return this.utils.ifEmptyGivesError(await this.modelService.getMovieByIdAndGroupId(id, groupId), MovieNotFoundException);
    }

    async deleteMovieByIdAndGroupId(id: number, groupId: number) {
        await this.getMovieByIdAndGroupId(id, groupId);
        return this.modelService.deleteMovieById(id);
    }

    async getTaskByIdAndGroupId(id: number, movieId: number) {
        return this.utils.ifEmptyGivesError(await this.modelService.getTaskByIdAndGroupId(id, movieId), MovieTaskNotFoundException);
    }

    async restartTaskByIdAndGroupId(id: number, groupId: number) {
        const task = await this.getTaskByIdAndGroupId(id, groupId);

        if (!task.isError) throw TaskIsAlreadyRunningConflictException;

        await this.modelService.setTaskErrorStatusById(id, false);
        return this.tasksService.sendMessageToMovieParserQueue({
            taskId: id
        });
    }
}
