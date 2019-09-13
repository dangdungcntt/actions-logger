# actions logger

### Install dependencies
```bash
npm install
```

### Prepare `.env` file
```bash
cp .env.sample .env
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

### Run
```bash
node index.js
```

### Create user
```bash
curl -X POST \
  http://localhost:3000/api/auth/register \
  -d '{
	"username": "<username>",
	"password": "<password>",
	"token": "<admintokenkey>"
}'
```

### Build Docker Image
```bash
docker build -t <image_name>:<tag> .
```

### Docker Run 
```bash
docker run -d --name actions_logger \
    -e APP_PORT=3000 \
    -e JWT_KEY=jwtsecretkey \
    -e JWT_TTL=2592000000 \
    -e ADMIN_TOKEN=admintokenkey
    -e MONGODB_URI=<mongodb_uri_here>
    --restart always \
    <image_name>:<tag>
```