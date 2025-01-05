import WebSocket from "ws";

class InMemoryStore {
  public userConnections: Record<string, WebSocket> = {};

  private static instance: InMemoryStore;

  private constructor() {}

  public static getInstance() {
    if(!InMemoryStore.instance) {
      InMemoryStore.instance = new InMemoryStore();
    }
    return InMemoryStore.instance;
  }
}

export const inMemoryStore = InMemoryStore.getInstance();