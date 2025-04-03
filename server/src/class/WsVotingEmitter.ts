import { RequestWithUser } from '@/modules/api.router';
import CustomEmitter from '@/shared/class/custom-emitter';
import BadRequestError from '@/shared/error/api-error/bad-request.error';
import { Response } from 'express';
import { v4 as uuid4 } from 'uuid';

class WsVotingEmitter {
  private readonly emitter: CustomEmitter;
  private readonly _rooms: Record<string, string[]>;
  
  public constructor() {
    this._rooms = {};
    this.emitter = new CustomEmitter();
  }
  
  /*
   * ===================================
   */
  
  public broadcastRoom(event: string, votingId: string, msg?: any) {
    const room = this.getRoom(votingId);
    if (room.length) this.emitter.broadcast(event, room, msg);
  }
  
  private getRoom(votingId: string) {
    return this._rooms?.[votingId] || [];
  }
  
  private getRoomCount(votingId: string): number {
    return this.getRoom(votingId).length;
  }
  
  private addToRoom(votingId: string, userId: string) {
    if (!Object.hasOwn(this._rooms, votingId)) {
      this._rooms[votingId] = [userId];
    } else {
      this._rooms[votingId]!.push(userId);
    }
  }
  
  private removeFromRoom(votingId: string, userId: string) {
    if (Object.hasOwn(this._rooms, votingId)) {
      const index = this._rooms[votingId]!.indexOf(userId);
      this._rooms[votingId]!.splice(index, 1);
      
      if (!this._rooms[votingId]!.length) {
        delete this._rooms[votingId];
      }
    }
  }
  
  /*
   * ===================================
   */
  
  public connect(req: RequestWithUser, res: Response) {
    const votingId = req.params?.['id'];
    const observerId = req?.extraContext?.userId || uuid4();
    
    if (!votingId) {
      throw new BadRequestError('votingId must be provided');
    }
    
    const handlers = this.getHandlers(res);
    
    res.writeHead(200, {
      'Connection': 'keep-alive',
      'Content-Type': 'text/event-stream; charset=UTF-8',
      'Cache-Control': 'no-cache',
    });
    
    /*
     * ==============================
     */
    
    this.emitter.on(handlers.close.name, handlers.close.fn);
    this.emitter.on(handlers.update.name, handlers.update.fn);
    this.emitter.on(handlers.refresh.name, handlers.refresh.fn);
    this.emitter.on(handlers.completed.name, handlers.completed.fn);
    
    this.emitter.add(observerId);
    this.addToRoom(votingId, observerId);
    this.broadcastRoom(handlers.refresh.name, votingId, this.getRoomCount(votingId));
    
    /*
     * ==============================
     */
    
    res.on('close', () => {
      this.emitter.off(handlers.close.name, handlers.close.fn);
      this.emitter.off(handlers.update.name, handlers.update.fn);
      this.emitter.off(handlers.refresh.name, handlers.refresh.fn);
      this.emitter.off(handlers.completed.name, handlers.completed.fn);
      
      this.emitter.remove(observerId);
      this.removeFromRoom(votingId, observerId);
      this.broadcastRoom(handlers.refresh.name, votingId, this.getRoomCount(votingId));
      
      handlers.close.fn();
    });
  }
  
  private getHandlers(res: Response) {
    const names = {
      close: 'close',
      update: 'update',
      refresh: 'refresh',
      completed: 'completed',
    };
    
    function event(event: string) {
      return `event: ${event}\n`;
    }
    
    function message(msg: { type: string; payload?: any }) {
      return `data: ${JSON.stringify(msg)}\n\n`;
    }
    
    return {
      close: {
        name: names.close,
        fn: () => {
          res.write(event(names.close));
          res.write(message({ type: names.close }));
          res.end();
        },
      },
      update: {
        name: names.update,
        fn: (msg: any) => {
          res.write(message({ type: names.update, payload: msg }));
        },
      },
      refresh: {
        name: names.refresh,
        fn: (msg: number) => {
          res.write(message({ type: names.refresh, payload: msg }));
        },
      },
      completed: {
        name: names.completed,
        fn: () => {
          res.write(message({ type: names.completed }));
        },
      },
    };
  }
}

export default WsVotingEmitter;