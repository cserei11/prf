# Base image
FROM node:20

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies **inside the Docker container**
RUN npm install

# Copy the rest of the application
COPY . .

# Build the app
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the app
CMD ["node", "dist/app.js"]
