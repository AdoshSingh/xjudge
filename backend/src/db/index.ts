import { connectionManager } from "./connectionManager";

export const connectToDatabase = async (dbUrl: string) => {
  try {
    await connectionManager.connectToDb(dbUrl);
    console.log("Connected to database successfully!");
  } catch (error) {
    console.log("Connection to database failed: ", error);
  }
}