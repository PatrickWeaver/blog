PW Blog
==
![version: 0.0.4](https://img.shields.io/badge/version-0.0.4-green.svg?style=flat-square)

#### To build Docker container:

`docker build -t patrickweaver/blog:[VERSION NUMBER] .`

#### To run docker container in development:

`docker run -v $PWD:/usr/src/blog --env API_URL=[API DOCKER NETWORK IP] --env API_PORT=8000 --env CLIENT_URL=localhost --env CLIENT_PORT=8106 --env BLOGNAME="Patrick Weaver Blog"
--env PORT=8106
--env AUTH_SECRET="abc123"
--env ADMIN_PASSWORD="pw"
--env ADMIN_EMAIL="admin@example.com" --env ENV=DEV -p 8106:8106 --net pwapi --name blog patrickweaver/blog:[VERSION NUMBER]`

#### To run docker container in production:

`docker run --env API_URL=[http:// API URL] --env API_PORT=80  --env CLIENT_URL=[http:// site URL] --env CLIENT_PORT=8106 --env BLOGNAME="Patrick Weaver Blog" --env PORT=8106 --env AUTH_SECRET=[actual secret]
--env ADMIN_PASSWORD=[actual password]
--env ADMIN_EMAIL=[actual email] ENV=PRODUCTION -p 8106:8106 --name blog patrickweaver/blog:[VERSION NUMBER]`


### Run docker in DEV with staging API:
`docker run -v $PWD:/usr/src/blog --env API_URL=[http:// STAGING API URL]  --env API_PORT=80 BLOGNAME="Patrick Weaver Blog"
--env PORT=8106
--env AUTH_SECRET="abc123"
--env ADMIN_PASSWORD="pw"
--env ADMIN_EMAIL="admin@example.com" --env ENV=DEV -p 8106:8106 --name blog patrickweaver/blog:[VERSION NUMBER]`


### Run locally in DEV:
```
npm install

API_URL=http://localhost API_PORT=8000 BLOGNAME="Patrick Weaver Blog"
PORT=8106
AUTH_SECRET="abc123"
ADMIN_PASSWORD="pw"
ADMIN_EMAIL="admin@example.com" ENV=DEV npm start
```
