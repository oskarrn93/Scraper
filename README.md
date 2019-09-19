# Scraper


## Dev

## Docker ssh to container

```
docker ps
docker exec -it <image id> /bin/bash
```

### SSH tunnel to access ports on remote server from computer

### api
```
ssh -N -L 8001:localhost:8001 oskar@server
```

### mongodb
```
ssh -N -L 27017:localhost:27017 oskar@server
```
