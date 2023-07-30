import amqplib from "amqplib";
import { config } from "./lib/config";
import { manager } from ".";
const DELEGATION_QUEUE_NAME = config.amqp.queueName;

type Delegation = {
    id: string;
    channelNames: string[];
};

export async function initAMQP() {
    const conn = await amqplib.connect(
        `amqp://${config.amqp.user}:${config.amqp.password}@${config.amqp.url}`
    );

    console.log("[AMQP] Connected to server");

    const channel = await conn.createChannel();
    await channel.assertQueue(DELEGATION_QUEUE_NAME);
    console.log("[AMQP] Connected to queue", DELEGATION_QUEUE_NAME);

    manager.on("update", () => {
        const streams = manager.getStreams();

        for (const nodeId of streams.keys()) {
            const channelNames = streams.get(nodeId);
            if (!channelNames) continue;

            const delegation: Delegation = {
                id: nodeId,
                channelNames: Array.from(channelNames),
            };
            channel.sendToQueue(
                DELEGATION_QUEUE_NAME,
                Buffer.from(JSON.stringify([delegation]))
            );
        }
    });
}
