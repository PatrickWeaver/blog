PW Blog
==
#### Version 0.1.1

## Required ENV Variables:

```
API_URL
API_PORT
API_VERSION // So far there is only 1
CLIENT_URL
CLINET_PORT
BLOGNAME
PORT
AUTH_SECRET // for passport
ENV // use DEV or GLITCH in dev
```

#### To build Docker container:

`docker build -t patrickweaver/blog:[VERSION NUMBER] .`

#### To run docker container in development:

If API is also running in a docker container connect to network:
- get API network ip address:
  `docker network inspect [network name]`
- Set API_URL ENV variable
- Then change API_URL ENV Variable and restart container
  `docker network connect [network name] [container name]`


`docker run -v $PWD:/usr/src/blog --env API_URL=[API DOCKER NETWORK IP] --env API_PORT=8000 --env API_VERSION=1 --env CLIENT_URL=localhost --env CLIENT_PORT=8106 --env BLOGNAME="Patrick Weaver Blog"
--env PORT=8106
--env AUTH_SECRET="abc123"
--env ENV=DEV -p 8106:8106 --net pwapi --name blog patrickweaver/blog:[VERSION NUMBER]`

#### To run docker container in production:

`docker run --env API_URL=[http:// API URL] --env API_PORT=80 --env API_VERSION=1 --env CLIENT_URL=[http:// site URL] --env CLIENT_PORT=8106 --env BLOGNAME="Patrick Weaver Blog" --env PORT=8106 --env AUTH_SECRET=[actual secret] -ENV=PRODUCTION -p 8106:8106 --name blog patrickweaver/blog:[VERSION NUMBER]`


### Run docker in DEV with staging API:
`docker run -v $PWD:/usr/src/blog --env API_URL=[http:// STAGING API URL]  --env API_PORT=80 --env API_VERSION=1 BLOGNAME="Patrick Weaver Blog"
--env PORT=8106
--env AUTH_SECRET="abc123"
--env ENV=DEV -p 8106:8106 --name blog patrickweaver/blog:[VERSION NUMBER]`


### Run locally in DEV:
```
npm install

npm run build && API_URL=http://localhost API_PORT=8000 API_VERSION=1 CLIENT_URL=http://localhost CLIENT_PORT=8106 BLOGNAME="Patrick Weaver Blog" PORT=8106 AUTH_SECRET="abc123" ENV=DEV npm start
```
