import { StreamsManager } from "./lib/streamsManager";
import { config } from "./lib/config";
import { initREST } from "./rest";
import { initAMQP } from "./amqp";
import { db } from "./lib/db";

export const manager = new StreamsManager(config.nodeIds);

async function populateFromDb() {
    const rows: {
        CHANNEL_NAME: string;
    }[] = await db.pool.query(
        `SELECT CHANNEL_NAME FROM ${config.db.database}.CHANNELS`
    );

    const channelNames = rows.map((x) => x.CHANNEL_NAME);

    console.log("[DB] Populating with", channelNames.length, "channels");
    manager.add(channelNames);
}

async function main() {
    await populateFromDb();
    await initREST();
    await initAMQP();
}

main();
