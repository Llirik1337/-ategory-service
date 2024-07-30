# HOW TO START
``` bash
docker-compose -f docker-compose-env.yml -f docker-compose-apps.yml up -d
```

# CATEGORY ENV

| ENV              | REQURED |          DEFAULT          | DESCRIPTION                |
| :--------------- | :-----: | :-----------------------: | :------------------------- |
| MONGODB_URL      |   NO    | mongodb://localhost:27017 | MongoDB url for connection |
| MONGODB_DATABASE |   NO    |         UNDEFINED         | MongoDB database           |
| MONGODB_DATABASE |   NO    |         UNDEFINED         | MongoDB database           |
| NATS_URL   |   NO    | nats://127.0.0.1:4222 | NATS url for connection |
| NATS_QUEUE |   NO    |       UNDEFINED       | NATS queue              |
| DEFAULT_PAGE_SIZE |   NO    |       2       | default page size              |
| DEFAULT_SORT_DIRECTION |   NO    |       -1       | default sort direction              |
| DEFAULT_SORT_BY |   NO    |       createdDate       | default sort by              |



