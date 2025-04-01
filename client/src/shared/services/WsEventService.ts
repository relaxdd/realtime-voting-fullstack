import { z } from 'zod';
import ReconnectEventSource from 'reconnecting-eventsource';

const enum WsServiceState {
  online = 'online',
  offline = 'offline',
  reconnecting = 'reconnecting',
}

type Any = any

type WsEventPayload<T extends Record<string, Any>> = {
  error: [Event];
  close: [Event];
  connect: [Event];
  message: [T, MessageEvent<unknown>];
  changeConnectionState: [WsServiceState]
}

// <K extends string, T extends readonly ZodDiscriminatedUnionOption<K>[]>
interface IWsServiceEvents<T extends Record<string, Any>> {
  onClose?: (event: Event) => void,
  onError?: (event: Event) => void,
  onConnect?: (event: Event) => void,
  onMessage?: (data: T, event: MessageEvent<Any>) => void,
  onChangeConnectionState?: (connectionState: WsServiceState) => void,
}

type WsEventHandlers<T extends Record<string, Any[]>> = {
  [K in keyof T]: ((...args: T[K]) => void)[];
};

/*
 * =====================================
 */

class WsEventService {
  private retryNumber = 0;
  
  private source: ReconnectEventSource | null;
  private schema: ReturnType<typeof this.getSchema>;
  private events: IWsServiceEvents<z.infer<ReturnType<typeof this.getSchema>>> | undefined;
  
  private readonly handlers: WsEventHandlers<WsEventPayload<z.infer<ReturnType<typeof this.getSchema>>>>;
  
  public url: string;
  public connectionState: WsServiceState;
  public readonly readyStates = ['CONNECTING', 'OPEN', 'CLOSED'] as const;
  
  private getSchema() {
    return z.discriminatedUnion('type', [
      z.object({ type: z.literal('refresh'), payload: z.number().int().min(0) }),
      z.object({ type: z.literal('connect'), payload: z.never().optional() }),
      z.object({ type: z.literal('update'), payload: z.never().optional() }),
    ]);
  }
  
  public constructor(url: string, events?: IWsServiceEvents<z.infer<ReturnType<typeof this.getSchema>>>) {
    this.url = url;
    this.events = events;
    this.schema = this.getSchema();
    
    this.handlers = {
      error: [],
      close: [],
      connect: [],
      message: [],
      changeConnectionState: [],
    };
    
    this.connectionState = WsServiceState.offline;
    this.changeConnectionState(this.connectionState);
    
    this.source = this.createEventSource();
  }
  
  /*
   * ==============================
   */
  
  private createEventSource() {
    const source = new ReconnectEventSource(this.url, {
      withCredentials: false,
    });
    
    source.addEventListener('error', this.onErrorHandler.bind(this));
    source.addEventListener('open', this.onConnectHandler.bind(this));
    source.addEventListener('message', this.onMessageHandler.bind(this));
    source.addEventListener('close', this.onCloseHandler.bind(this), { once: false });
    
    return source;
  }
  
  public disconnect() {
    if (!this.source) return;
    if (this.isReadyState('closed')) return;
    
    this.source.removeEventListener('error', this.onErrorHandler.bind(this));
    this.source.removeEventListener('open', this.onConnectHandler.bind(this));
    this.source.removeEventListener('message', this.onMessageHandler.bind(this));
    this.source.removeEventListener('close', this.onCloseHandler.bind(this));
    
    this.source.close();
    this.changeConnectionState(WsServiceState.offline);
    this.source = null;
  }
  
  public connect(): void {
    this.disconnect();
    this.source = this.createEventSource();
  }
  
  /*
   * ==============================
   */
  
  public onError(cb: (event: Event) => void) {
    this.handlers.error.push(cb);
  }
  
  public onConnect(cb: (event: Event) => void) {
    this.handlers.connect.push(cb);
  }
  
  public onMessage(cb: (data: z.infer<ReturnType<typeof this.getSchema>>, event: MessageEvent<unknown>) => void) {
    this.handlers.message.push(cb);
  }
  
  public onClose(cb: (event: Event) => void) {
    this.handlers.close.push(cb);
  }
  
  public onChangeConnectionState(cb: (connectionState: WsServiceState) => void) {
    this.handlers.changeConnectionState.push(cb);
  }
  
  /*
   * ==============================
   */
  
  private changeConnectionState(connectionState: WsServiceState) {
    this.connectionState = connectionState;
    this.events?.onChangeConnectionState?.(connectionState);
    this.notifyListeners('changeConnectionState', [connectionState]);
  }
  
  // private changeReadyState(readyState: 0|1|2) {}
  
  /*
   * ==============================
   */
  
  private onCloseHandler(event: Event) {
    this.disconnect();
    
    this.events?.onClose?.(event);
    this.notifyListeners('close', [event]);
  }
  
  private onErrorHandler(event: Event) {
    if (this.retryNumber < 5) {
      this.retryNumber += 1;
      
      if (this.connectionState !== WsServiceState.reconnecting) {
        this.changeConnectionState(WsServiceState.reconnecting);
      }
    } else {
      this.disconnect();
      this.retryNumber = 0;
      
      this.events?.onError?.(event);
      this.notifyListeners('error', [event]);
    }
  }
  
  private onConnectHandler(event: Event) {
    this.changeConnectionState(WsServiceState.online);
    this.events?.onConnect?.(event);
    this.notifyListeners('connect', [event]);
  }
  
  private onMessageHandler(event: MessageEvent<unknown>) {
    try {
      if (typeof event.data !== 'string') {
        console.error('[EventSource] Ответ с сервера не является валидным JSON');
        return;
      }
      
      const data = JSON.parse(event.data);
      const safe = this.schema.parse(data);
      
      this.events?.onMessage?.(safe, event);
      this.notifyListeners('message', [safe, event]);
    } catch (err) {
      console.error((err as Error)?.message);
    }
  }
  
  /*
   * ==============================
   */
  
  private notifyListeners<
    T extends keyof WsEventPayload<z.infer<ReturnType<typeof this.getSchema>>>
  >(
    event: T,
    args: WsEventPayload<z.infer<ReturnType<typeof this.getSchema>>>[T],
  ) {
    for (const handler of this.handlers[event]) {
      handler(...args);
    }
  }
  
  private isReadyState(state: 'connecting' | 'open' | 'closed' | 0 | 1 | 2): boolean {
    const readyState = this.source ? this.source.readyState : EventSource.CLOSED;
    
    if (typeof state === 'number')
      return readyState === state;
    else {
      const upperState = state.toUpperCase() as Uppercase<typeof state>;
      return readyState === EventSource[upperState];
    }
  }
}

export default WsEventService;