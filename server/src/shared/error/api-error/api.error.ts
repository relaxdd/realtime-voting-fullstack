/**
 * @version 1.0.0
 */
class ApiError extends Error {
  public code: number;
  public details: object | undefined;
  
  constructor(message: string, code: number, details?: object) {
    super(message);
    
    this.name = 'ApiError';
    this.code = code;
    this.details = details;
  }
  
  public toObject(stack = false) {
    return ApiError.toObject<ApiError>(this, stack);
  }
  
  public override toString() {
    return JSON.stringify(this.toObject());
  }
  
  // ********* Static methods ********* //
  
  public static toObject<T extends Error>(error: T, stack = false) {
    const baseErrorKeys = ['name', 'message', 'stack'] as const;
    
    type BaseErrorKeys = typeof baseErrorKeys[number];
    type ErrorKeys = BaseErrorKeys | string
    type InitialKeys = keyof typeof error
    
    const keys = [...new Set([...baseErrorKeys, ...Reflect.ownKeys(error)])] as InitialKeys[];
    
    if (!stack) {
      const index = keys.indexOf('stack');
      if (index !== -1) keys.splice(index, 1);
    }
    
    return keys.reduce<Record<ErrorKeys, string | number | object>>((obj, k) => {
      if (typeof error[k] === 'function') return obj;
      obj[k as ErrorKeys] = error[k] as string | number | object;
      return obj;
    }, {} as never);
  }
  
  public static from(error: Error, status: number, message?: string, additional: Record<string, any> = {}, stack = false) {
    return new ApiError(message || error.message, status, Object.assign(this.toObject(error, stack), additional));
  }
}

export default ApiError;
