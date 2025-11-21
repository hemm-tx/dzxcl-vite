import { invoke, type InvokeArgs, type InvokeOptions } from "@tauri-apps/api/core";

export class UseInvoke {
  private onSuccess?: <T>(res: T) => void;
  private onError?: <T>(err: T) => void;
  private onFinally?: () => void;

  constructor() {}

  success(call: <T>(res: T) => void) {
    this.onSuccess = call;
    return this;
  }

  error(call: <T>(err: T) => void) {
    this.onError = call;
    return this;
  }

  finally(call: () => void) {
    this.onFinally = call;
    return this;
  }

  async invoke(cmd: string, args?: InvokeArgs, options?: InvokeOptions) {
    try {
      const res = await invoke(cmd, args, options);
      this.onSuccess?.(res);
    } catch (e) {
      this.onError?.(e);
    } finally {
      this.onFinally?.();
    }
  }

  dispose() {
    this.onSuccess = undefined;
    this.onError = undefined;
  }
}
