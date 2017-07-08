PW Blog
==
[![GitHub version](https://badge.fury.io/gh/patrickweaver%2Fblog.svg)](https://badge.fury.io/gh/patrickweaver%2Fblog)

#### To build Docker container:

`docker build -t patrickweaver/blog:[VERSION NUMBER] .`

#### To run docker container in development:

`docker run -v $PWD:/usr/src/blog --env API_URL=[API URL] --env ENV=DEV -p 8106:8106 --name blog patrickweaver/blog:[VERSION NUMBER]`

#### To run docker container in production:

`docker run --env API_URL=[API URL] --env ENV=PRODUCTION -p 8106:8106 --name pwapi patrickweaver/blog:[VERSION NUMBER]`
