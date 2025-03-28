import CustomEmitter from '@/shared/class/CustomEmitter'
import WsEventHandlers, { WsEventNames } from '@/shared/class/WsEventHandlers'
import BadRequestError from '@/shared/error/class/BadRequestError'
import { NextFunction, Request, Response } from 'express'
import { v4 as uuid4 } from 'uuid'

class VotingController {
  private emitter: CustomEmitter

  public constructor() {
    this.emitter = new CustomEmitter()
  }

  /*
   * ========================================
   */

  public hi(_: Request, res: Response) {
    res.json({ message: 'Hello world!' })
  }

  public answer(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params?.['id'] || null
      if (!id) next(new BadRequestError('Bad Request'))
    } catch (err) {
      next(err)
    }
  }

  public connect(req: Request, res: Response, next: NextFunction) {
    try {
      const votingId = req.params?.['id']
      const handlers = new WsEventHandlers(res)
      const observerId = uuid4()

      // TODO: Доставать из куки ID пользоватлея

      /*
       * ==============================
       */

      res.writeHead(200, {
        Connection: 'keep-alive',
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
      })

      this.emitter.on(WsEventNames.Close, handlers.close.bind(handlers))
      this.emitter.on(WsEventNames.Update, handlers.update.bind(handlers))
      this.emitter.on(WsEventNames.Offline, handlers.offline.bind(handlers))
      this.emitter.on(WsEventNames.Refresh, handlers.refresh.bind(handlers))

      this.emitter.add(observerId)
      this.emitter.emit(WsEventNames.Refresh, this.emitter.count)

      /*
       * ==============================
       */

      res.on('close', () => {
        this.emitter.off(WsEventNames.Close, handlers.close.bind(handlers))
        this.emitter.off(WsEventNames.Update, handlers.update.bind(handlers))
        this.emitter.off(WsEventNames.Offline, handlers.offline.bind(handlers))
        this.emitter.off(WsEventNames.Refresh, handlers.refresh.bind(handlers))

        this.emitter.remove(observerId)
        this.emitter.emit(WsEventNames.Refresh, this.emitter.count)

        res.end()
      })

      handlers.connect()
    } catch (err) {
      next(err)
    }
  }
}

export default VotingController
