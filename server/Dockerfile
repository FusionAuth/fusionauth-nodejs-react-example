#####################
## Stage 1 - Build ##
#####################
# Use latest LTS node
FROM node:10-alpine

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Storing node modules on another layer will prevent unnecessary npm installs each build
RUN npm ci --only=production && mkdir /app && mv ./node_modules ./app

# Set working directory.
WORKDIR /app

# Add app to directory
COPY . .

# Expose APP ports
EXPOSE 5000
EXPOSE 5001

# Run the Node application
CMD ["node", "server.js"]