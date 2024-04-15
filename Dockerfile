# Use Node.js 20 as base image
FROM node:alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to work directory
COPY package.json /app

# Install pnpm 
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install

# Copy the rest of the application
COPY . .

# Expose port 3000 (or any other port your application uses)
EXPOSE 3000