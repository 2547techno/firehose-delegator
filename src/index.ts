import { StreamsManager } from "./lib/streamsManager";
import { config } from "./lib/config";
import { initREST } from "./rest";
import { initAMQP } from "./amqp";

export const manager = new StreamsManager(config.nodeIds);

async function main() {
    await initREST();
    await initAMQP();
}

main();
