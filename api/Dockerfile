FROM node:carbon

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json .
# For npm@5 or later, copy package-lock.json as well
# COPY package.json package-lock.json ./

RUN npm install
RUN sed -i 's/LoopBack API Explorer/API Explorer/g' node_modules/loopback-component-explorer/public/index.html

# Bundle app source
COPY . .

CMD [ "npm", "start" ]
