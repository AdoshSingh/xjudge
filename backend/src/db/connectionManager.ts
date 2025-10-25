import mongoose from "mongoose";
 
class ConnectionManager {
  private connection: mongoose.Mongoose | null = null;
  private dbUrl: string = "";

  public async connectToDb(dbUrl: string) {
    this.dbUrl = dbUrl;
    this.connection = await mongoose.connect(dbUrl);
  }

  private static instance: ConnectionManager;

  private constructor() {}

  public static getInstance() {
    if(!ConnectionManager.instance) {
      ConnectionManager.instance = new ConnectionManager();
    }
    return ConnectionManager.instance;
  }
}

export const connectionManager = ConnectionManager.getInstance();