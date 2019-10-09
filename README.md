# Scraper


## Docker

## Start all containers
```sh
docker-compose up -d
```

## Restart all containers
```sh
docker-compose down && docker-compose up -d
```

## Docker ssh to container
```sh
docker ps
docker exec -it <image id> /bin/bash
```



### SSH tunnel to access ports on remote server from computer

### api
```sh
ssh -N -L 8001:localhost:8001 oskar@server
```

### mongodb
```sh
ssh -N -L 27017:localhost:27017 oskar@server
```

### Run on server

```sh
nodejs /home/oskar/github/Scraper/src/scraper.js cs 2>&1 > logger >> /var/log/scraper/scraper.log
nodejs /home/oskar/github/Scraper/src/scraper.js football 2>&1 > logger >> /var/log/scraper/scraper.log
nodejs /home/oskar/github/Scraper/src/scraper.js nba 2>&1 > logger >> /var/log/scraper/scraper.log
```

```sh
nodejs /home/oskar/github/Scraper/src/api.js 2>&1 > logger >> /var/log/scraper/api.log &
```
