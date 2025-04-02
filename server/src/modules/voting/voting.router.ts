import { Router } from 'express';
import VotingController from './voting.controller';

class VotingRouter {
  public readonly router: Router;
  public readonly controller: VotingController;
  
  public constructor() {
    this.router = Router();
    this.controller = new VotingController();
    
    this.router.get('/', this.controller.hi.bind(this.controller));
    this.router.get('/connect/:id', this.controller.connect.bind(this.controller));
  }
}

export default VotingRouter;