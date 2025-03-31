class LocalStorage {
  public static has(key: string) {
    return Object.hasOwn(window.localStorage, key)
  }
  
  public static get(key: string) {
    return window.localStorage.getItem(key)
  }
  
  public static set(key: string, value: string) {
    window.localStorage.setItem(key, value)
  }
  
  public static remove(key: string) {
    window.localStorage.removeItem(key)
  }
}

export default LocalStorage