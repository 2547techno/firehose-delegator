![diagram](https://github.com/2547techno/firehose-node/assets/109011672/f5a4b51d-86ac-42e6-9ca0-a5ad460805f4)

## Config

`config.json`

```jsonc
{
    "nodeIds": [
        // list of firehose nodes to delegate
        "node1",
        "node2"
    ],
    "amqp": {
        // rabbitmq creds
        "url": "localhost",
        "user": "user",
        "password": "password",
        "queueName": "firehose-delegation" // queue name to send delegation messages to
    },
    "rest": {
        "port": 3000 // port REST API is served on
    },
    "db": {
        // mariadb creds
        "host": "192.168.0.1",
        "user": "user",
        "password": "password",
        "database": "FIREHOSE" // database to persist channel names to
    }
}
```

## Database

### `CHANNELS` Table

DDL:

```
CREATE TABLE `CHANNELS` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `CHANNEL_NAME` varchar(25) NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `CHANNELS_UN` (`CHANNEL_NAME`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

## REST API

### `PUT /channels`

`application/json` body:

```json
{
    "channels": [
        "channel1",
        "channel2",
        ...
    ]
}
```

Add channels to be delegated. Nodes will JOIN these channels.

### `DELETE /channels`

`application/json` body:

```json
{
    "channels": [
        "channel1",
        "channel2",
        ...
    ]
}
```

Remove channels from delegation. Nodes will PART these channels.
