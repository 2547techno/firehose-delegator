import EventEmitter from "events";

export enum Method {
    ROUND_ROBBIN,
}

export class StreamsManager extends EventEmitter {
    private streams;
    private method;
    private ids;
    private rrI;

    constructor(ids: string[], method = Method.ROUND_ROBBIN) {
        super();
        this.ids = ids;
        this.streams = new Map<string, Set<string>>();
        for (const id of this.ids) {
            this.streams.set(id, new Set<string>());
        }
        this.method = method;
        this.rrI = 0;
    }

    getStreams() {
        return this.streams;
    }

    add(channelNames: string[]) {
        channelNames = channelNames.filter(
            (channelName) => !this.isDelegated(channelName)
        );

        switch (this.method) {
            case Method.ROUND_ROBBIN: {
                this.addRoundRobbin(channelNames);
                break;
            }
            default: {
                throw new Error("Uknown delegation method");
            }
        }

        this.emit("update");
    }

    private addRoundRobbin(channelNames: string[]) {
        for (const channelName of channelNames) {
            const id = this.ids[this.rrI];
            this.streams.get(id)?.add(channelName);
            this.rrI = ++this.rrI % this.ids.length;
        }
    }

    isDelegated(channelName: string) {
        for (const nodeId of this.streams.keys()) {
            if (this.streams.get(nodeId)?.has(channelName)) {
                return true;
            }
        }
        return false;
    }

    remove(channelNames: string[]) {
        for (const channelName of channelNames) {
            for (const nodeId of this.streams.keys()) {
                this.streams.get(nodeId)?.delete(channelName);
            }
        }

        this.emit("update");
    }
}
