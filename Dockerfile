# Use Node.js 20 as base image
FROM node:20.10.0

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to work directory
COPY package.json .

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build:production

# Expose port 3000 (or any other port your application uses)
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
