# initializes new build stage and sets base image
FROM node:latest

# sets the working directory for RUN, CMD, ENTRYPOINT, etc 
WORKDIR /app

# copying the package.json and package-lock.json in our source code to node image /app
COPY package*.json .

# install all dependencies in package.json by running npm install
RUN npm install

# copy all the source to /app to track all the changes
# we copy package.json first because docker cache all layer that isn't changed
# so if the package not change then we dont have to npm install all over again
COPY . .

# informs Docker that container listens on specified network ports
EXPOSE 3000

# execute command when container is starting at runtime
CMD [ "node", "index.js" ]

# to build this image
# cd /path
# docker build . -t arkandamar/node-app 
# docker run -d --name nodeapp --publish 3000:3000 arkandamar/node-app
# -d for --detach or running container in background