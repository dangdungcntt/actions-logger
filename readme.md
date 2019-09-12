# actions logger

### Install dependencies
```bash
npm install
```

### Prepare database
collection: `actions`

indexes:
```json
{"id": 1}
```

```json
{"text": 1}
```

```json
{"text": "text"}
```

### Build
```bash
docker build -t <image_name>:<tag> .
```

### Run
```bash
docker run -d --name actions_logger \
    -e APP_PORT=3000 \
    -e MONGODB_URI=<mongodb_uri_here>
    --restart always \
    <image_name>:<tag>
```