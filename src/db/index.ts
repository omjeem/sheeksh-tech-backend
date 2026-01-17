import { drizzle } from "drizzle-orm/node-postgres";
import { envConfigs } from "@/config/envConfig";
import * as schema from "./schema";
import { Client } from "pg";

const DATABASE_URL = envConfigs.database_url;

const client = new Client(DATABASE_URL);

export const db = drizzle(client, { schema });

export const connectToDatabase = () => {
  client
    .connect()
    .then(() => {
      console.log("Postgress Client Connected Successfully");
    })
    .catch((error: any) => {
      console.log("Error While connecting with postgress Client", error);
    });
};
