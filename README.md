PW Blog
==
![version: 0.0.4](https://img.shields.io/badge/version-0.0.4-green.svg?style=flat-square)

#### To build Docker container:

`docker build -t patrickweaver/blog:[VERSION NUMBER] .`

#### To run docker container in development:

`docker run -v $PWD:/usr/src/blog --env API_URL=[API DOCKER NETWORK IP] --env API_PORT=8000 --env ENV=DEV -p 8106:8106 --net pwapi --name blog patrickweaver/blog:[VERSION NUMBER]`

#### To run docker container in production:

`docker run --env API_URL=[http:// API URL] --env API_PORT=80 --env ENV=PRODUCTION -p 8106:8106 --name blog patrickweaver/blog:[VERSION NUMBER]`


### Run docker in DEV with staging API:
`docker run -v $PWD:/usr/src/blog --env API_URL=[http:// STAGING API URL]  --env API_PORT=80 --env ENV=DEV -p 8106:8106 --name blog patrickweaver/blog:[VERSION NUMBER]`

### Run on computer in DEV:
```
npm install
API_URL=http://localhost API_PORT=8000 ENV=DEV npm start
```
