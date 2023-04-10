FROM node:14.20.0

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies in CI mode
RUN npm ci

# Copy the rest of the application code into the container
COPY . .

# Initiate SQLlite DB
RUN npm run init-db

# Make port 1337 available for the app to listen on
EXPOSE 1337

# Run the app
CMD [ "npm", "start" ]
