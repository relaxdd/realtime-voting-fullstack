import { z } from 'zod';

const enum WsServiceStatus {
  online = 'online',
  offline = 'offline',
  reconnecting = 'reconnecting',
}

// <K extends string, T extends readonly ZodDiscriminatedUnionOption<K>[]>
interface IWsServiceEvents<T extends Record<string, any>> {
  onError?: () => void,
  onConnect?: (event: Event) => void,
  onMessage?: (data: T, event: MessageEvent<any>) => void,
  onChangeConnectionState?: (status: WsServiceStatus) => void,
}

class WsEventService {
  private refetchNumber = 0;
  
  private source: EventSource;
  private schema: ReturnType<typeof this.getSchema>;
  private events: IWsServiceEvents<z.infer<ReturnType<typeof this.getSchema>>>;
  
  public url: string;
  public status: WsServiceStatus;
  
  private getSchema() {
    return z.discriminatedUnion('type', [
      z.object({ type: z.literal('refresh'), payload: z.number().int().min(0) }),
      z.object({ type: z.literal('connect'), payload: z.never().optional() }),
      z.object({ type: z.literal('update'), payload: z.never().optional() }),
    ]);
  }
  
  public constructor(url: string, events: IWsServiceEvents<z.infer<ReturnType<typeof this.getSchema>>>) {
    this.url = url;
    this.events = events;
    this.schema = this.getSchema();
    this.status = WsServiceStatus.offline;
    this.source = new EventSource(this.url, { withCredentials: false });
    
    this.source.addEventListener('error', this.onError.bind(this));
    this.source.addEventListener('open', this.onConnect.bind(this));
    this.source.addEventListener('message', this.onMessage.bind(this));
  }
  
  /*
   * ==============================
   */
  
  public disconnect() {
    this.source.close();
  }
  
  /*
   * ==============================
   */
  
  private onChangeConnectionState(status: WsServiceStatus) {
    this.status = status;
    this.events.onChangeConnectionState?.(status);
  }
  
  private onError() {
    console.log('Error occurred.');
    
    if (this.refetchNumber < 5) {
      this.refetchNumber += 1;
      this.onChangeConnectionState(WsServiceStatus.reconnecting);
    } else {
      this.source.close();
      console.warn(`[EventSource] Соединение с ${this.url} было закрыто`);
      this.onChangeConnectionState(WsServiceStatus.offline);
      this.events.onError?.();
    }
  }
  
  private onConnect(event: Event) {
    this.onChangeConnectionState(WsServiceStatus.online);
    this.events.onConnect?.(event);
  }
  
  private onMessage(event: MessageEvent<unknown>) {
    try {
      if (typeof event.data !== 'string') {
        console.error('[EventSource] Ответ с сервера не является валидным JSON');
        return;
      }
      
      const data = JSON.parse(event.data);
      const safe = this.schema.parse(data);
      
      this.events.onMessage?.(safe, event);
    } catch (err) {
      console.error((err as Error)?.message);
    }
  }
}

export default WsEventService;