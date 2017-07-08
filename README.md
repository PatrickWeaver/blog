PW Blog
==
![0.0.2](https://img.shields.io/badge/version-0.0.2-green.svg?style=flat-square)

#### To build Docker container:

`docker build -t patrickweaver/blog:[VERSION NUMBER] .`

#### To run docker container in development:

`docker run -v $PWD:/usr/src/blog --env API_URL=[API URL] --env ENV=DEV -p 8106:8106 --name blog patrickweaver/blog:[VERSION NUMBER]`

#### To run docker container in production:

`docker run --env API_URL=[API URL] --env ENV=PRODUCTION -p 8106:8106 --name pwapi patrickweaver/blog:[VERSION NUMBER]`
