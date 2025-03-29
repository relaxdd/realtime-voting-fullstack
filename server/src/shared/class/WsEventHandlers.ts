import { NextFunction, Request, Response } from 'express'

export const enum WsEventNames {
  Close = 'close',
  Update = 'update',
  Offline = 'offline',
  Refresh = 'refresh',
  Connect = 'connect',
}

class WsEventHandlers {
  private res: Response

  public constructor(response: Response) {
    this.res = response
  }

  /*
   * ==================================
   */

  public close() {
    this.res.write(WsEventHandlers.buildMsg({ type: WsEventNames.Close }))
  }

  public update(msg: any) {
    this.res.write(WsEventHandlers.buildMsg({ type: WsEventNames.Update, payload: msg }))
  }

  public offline(msg: boolean) {
    this.res.write(WsEventHandlers.buildMsg({ type: WsEventNames.Offline, payload: msg }))
  }

  public refresh(msg: number) {
    this.res.write(WsEventHandlers.buildMsg({ type: WsEventNames.Refresh, payload: msg }))
  }

  public connect() {
    this.res.write(WsEventHandlers.buildMsg({ type: WsEventNames.Connect }))
  }

  /*
   * ==================================
   */

  public static buildMsg(msg: { type: string; payload?: any }) {
    return `data: ${JSON.stringify(msg)}\n\n`
  }
}

export default WsEventHandlers