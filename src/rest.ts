import Express, { Request, Response, json } from "express";
import { manager } from ".";
import { db } from "./lib/db";
import { config } from "./lib/config";
const app = Express();
const PORT = config.rest.port ?? 3000;

const middleware = [json()];

app.put("/channels", middleware, async (req: Request, res: Response) => {
    console.log("[REST] PUT /channels");
    const channelNames: string[] = req.body.channels;
    if (!channelNames) {
        return res.status(400).json({
            message: "missing `channels` field",
        });
    }

    const notDelegated = channelNames.filter(
        (name) => !manager.isDelegated(name)
    );
    if (notDelegated.length === 0) {
        return res.send();
    }

    try {
        await db.pool.batch(
            `INSERT INTO ${config.db.database}.CHANNELS (CHANNEL_NAME) VALUES (?)`,
            notDelegated
        );
    } catch (err) {
        console.log(err);
        return res.status(500).send();
    }

    manager.add(notDelegated);
    res.send();
});

app.delete("/channels", middleware, async (req: Request, res: Response) => {
    console.log("[REST] DELETE /channels");
    const channelNames: string[] = req.body.channels;
    if (!channelNames) {
        return res.status(400).json({
            message: "missing `channels` field",
        });
    }

    try {
        await db.pool.batch(
            `DELETE FROM ${config.db.database}.CHANNELS WHERE CHANNEL_NAME = ?`,
            channelNames
        );
    } catch (err) {
        console.log(err);
        return res.status(500).send();
    }

    manager.remove(channelNames);
    res.send();
});

export function initREST() {
    return new Promise<void>((res) => {
        app.listen(PORT, () => {
            console.log(`[EXPRESS] Listening on ${PORT}`);
            res();
        });
    });
}
