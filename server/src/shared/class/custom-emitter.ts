import EventEmitter from 'events';

// const emitter = new EventEmitter();
// emitter.

class CustomEmitter extends EventEmitter {
  private _observers: string[];
  
  public constructor() {
    super();
    this._observers = [];
  }
  
  /**
   * Send a message to all connected listeners
   *
   * @param eventName
   * @param args
   */
  public override emit(eventName: string | symbol, ...args: any[]) {
    return super.emit(eventName, ...args);
  }
  
  /*
   * ==========================================
   */
  
  public get count() {
    return this._observers.length;
  }
  
  public get observers() {
    return this._observers;
  }
  
  public set observers(list: string[]) {
    this._observers = list;
  }
  
  /*
   * ==========================================
   */
  
  public set(list: string[] | ((prev: string[]) => string[])) {
    if (typeof list !== 'function') this.observers = list;
    else this.observers = list(this._observers);
  }
  
  public add(id: string) {
    if (!this.observers.includes(id)) {
      this.observers.push(id);
    }
  }
  
  public remove(id: string) {
    const index = this.observers.indexOf(id);
    this.observers.splice(index, 1);
  }
  
  public broadcastAll(event: string, exclude: (string | null)[], msg?: any) {
    const events = this.eventNames();
    
    if (!events.includes(event)) {
      console.warn(`The "${event}" event is not registered`);
      return;
    }
    
    exclude = exclude.filter(Boolean);
    
    const observers = this.observers;
    const receivers = observers.filter((it) => !exclude.includes(it));
    const indexes = receivers.map((id) => observers.indexOf(id!));
    
    this.customEmit(event, indexes, msg);
  }
  
  /**
   * Отправить сообщение некоторым слушателям
   *
   * @param type
   * @param receivers
   * @param msg
   * @returns
   */
  public broadcast(type: string, receivers: (string | null)[], msg?: any) {
    const events = this.eventNames();
    
    if (!events.includes(type)) {
      console.warn('Предупреждение: такое событие не добавлено!');
      return;
    }
    
    receivers = receivers.filter((it) => typeof it === 'string');
    const indexes = receivers.map((id) => this._observers.indexOf(id!));
    
    this.customEmit(type, indexes, msg);
  }
  
  /**
   * Кастомная рассылка по индексам handler
   *
   * @param type
   * @param indexes
   * @param msg
   * @returns
   */
  public customEmit(type: string, indexes: number[], msg?: any) {
    if (!indexes.length) return;
    
    const listeners = this.listeners(type);
    if (!listeners.length) return;
    
    for (const index of indexes) {
      if (index === -1) continue;
      const fn = listeners[index];
      
      if (typeof fn === 'function') fn(msg);
      else console.error(`Ошибка, под индексом ${index} нет слушателя!`);
    }
  }
  
  public each(type: string, receivers: (string | null)[], cb: (id: string) => any) {
    const events = this.eventNames();
    
    if (!events.includes(type)) {
      console.warn('Предупреждение: такое событие не добавлено!');
      return;
    }
    
    receivers = receivers.filter((it) => typeof it === 'string');
    
    const list = receivers.map((id) => ({
      id: id!,
      index: this._observers.indexOf(id!),
    }));
    
    if (!list.length) return;
    
    const listeners = this.listeners(type);
    if (!listeners.length) return;
    
    for (const { index, id } of list) {
      if (index === -1) continue;
      const fn = listeners[index];
      
      if (typeof fn === 'function') fn(cb(id));
      else console.error(`Ошибка, под индексом ${index} нет слушателя!`);
    }
  }
}

export default CustomEmitter;
