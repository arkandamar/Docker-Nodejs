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
CMD [ "npm", "run", "dev" ]

# to build this image
# cd /path
# docker build . -t arkandamar/node-app:latest
# docker run -d --name nodeapp --publish 3000:3000 arkandamar/node-app
# -d for --detach or running container in background

#? if we change the index.js and go to localhost:3000, nothing'll change because our image
#? is not updated (built) yet and our container using the stale version of image
#? so we've to build image and run container as long as there're changes, and that's not practical

#* to resolve this problem we can exploit usage of bind mounts to connect folder within the container
#* to our actual working dir in host system. to do that we can specified in container creation phase
#* docker run --mount "type=bind,source=D:\Road to Programmer\Docker\Docker-Nodejs\,destination=/app" --memory 800m --cpus 0.8 --publish 3000:3000 -d --name nodeapp arkandamar/node-app

#* then we can install nodemon so the nodejs refreshed everytime changes occured
#* maka script to run the nodemon in package.json ex: dev->nodemon index.js
#* then change CMD to run the npm run dev