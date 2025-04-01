import { Router } from 'express';
import VotingController from './voting.controller';

const votingRouter = Router();
const votingController = new VotingController();

votingRouter.get('/', votingController.hi.bind(votingController));
votingRouter.get('/connect/:id', votingController.connect.bind(votingController));

export { votingController };
export default votingRouter;