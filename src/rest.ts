import Express, { Request, Response, json } from "express";
import { manager } from ".";
const app = Express();
const PORT = process.env.PORT ?? 3000;

const middleware = [json()];

app.put("/channels", middleware, (req: Request, res: Response) => {
    console.log("[REST] PUT /channels");
    const channelNames: string[] = req.body.channels;
    if (!channelNames) {
        return res.status(400).json({
            message: "missing `channels` field",
        });
    }
    manager.add(channelNames);
    res.send();
});

app.delete("/channels", middleware, (req: Request, res: Response) => {
    console.log("[REST] DELETE /channels");
    const channelNames: string[] = req.body.channels;
    if (!channelNames) {
        return res.status(400).json({
            message: "missing `channels` field",
        });
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
