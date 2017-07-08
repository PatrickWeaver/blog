FROM node:boron

# Create app directory
RUN mkdir -p /usr/src/blog
WORKDIR /usr/src/blog

# Install app dependencies
COPY package.json /usr/src/blog
RUN npm install

# Bundle app source
COPY . /usr/src/blog



EXPOSE 8106
CMD [ "npm", "start" ]
