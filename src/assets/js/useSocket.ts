export class SocketService {
  private url: string;
  private socket?: WebSocket;
  private message?: (event: MessageEvent) => void;
  private open?: (event: Event, socket?: WebSocket) => void;
  private error?: (event: Event) => void;
  private close?: (event: CloseEvent) => void;

  constructor(url: string) {
    this.url = url;
  }

  onMessage(message: (event: MessageEvent) => void) {
    this.message = message;
    return this;
  }

  onOpen(open: (event: Event, socket?: WebSocket) => void) {
    this.open = open;
    return this;
  }

  onError(error: (event: Event) => void) {
    this.error = error;
    return this;
  }

  onClose(close: (event: CloseEvent) => void) {
    this.close = close;
    return this;
  }

  connect() {
    this.socket = new WebSocket(this.url);
    this.message && this.socket.addEventListener("message", this.message);
    this.open && this.socket.addEventListener("open", (e) => this.open?.(e, this.socket));
    this.error && this.socket.addEventListener("error", this.error);
    this.close && this.socket.addEventListener("close", this.close);

    return this;
  }

  disconnect() {
    this.message && this.socket?.removeEventListener("message", this.message);
    this.open && this.socket?.removeEventListener("open", this.open);
    this.close && this.socket?.removeEventListener("close", this.close);
    this.error && this.socket?.removeEventListener("error", this.error);
    this.socket?.close();
  }
}
