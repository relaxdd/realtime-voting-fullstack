import WsVotingEmitter from '@/class/WsVotingEmitter';
import { NextFunction, Request, Response } from 'express';

class VotingController {
  public emitter: WsVotingEmitter;
  
  public constructor() {
    this.emitter = new WsVotingEmitter();
  }
  
  public hi(_: Request, res: Response) {
    res.json({ message: 'Hello world!' });
  }
  
  public notify(votingId: string) {
    this.emitter.broadcastRoom('update', votingId);
  }
  
  public connect(req: Request, res: Response, next: NextFunction) {
    try {
      this.emitter.connect(req, res);
    } catch (err) {
      next(err);
    }
  }
}

export default VotingController;