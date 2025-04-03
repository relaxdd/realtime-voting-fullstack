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
  
  public notify(votingShortId: string) {
    this.emitter.broadcastRoom('update', votingShortId);
  }
  
  public completed(votingShortId: string) {
    this.emitter.broadcastRoom('completed', votingShortId);
    this.emitter.broadcastRoom('close', votingShortId);
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