import {SubscribeMessage, WebSocketGateway, OnGatewayConnection, OnGatewayInit, WsResponse} from '@nestjs/websockets';
import {Logger, UseGuards} from "@nestjs/common";
import {TestGuard} from "@modules/auth/guard/test.guard";


@UseGuards(TestGuard)
@WebSocketGateway({
  namespace: 'movies',
  cors: { origin: '*' }
})
export class MoviesGateway implements OnGatewayConnection, OnGatewayInit {
  private logger = new Logger('MoviesGateway');

  afterInit() {
    this.logger.log('Channel {/} is open');
  }

  @SubscribeMessage('message')
  handleSearchMovies(client: any, payload: any): WsResponse<unknown>{
    return { event: 'message', data: 'test' };
  }

  handleConnection(client: any, ...args): any {
    //console.log(client, args)
  } 
}
