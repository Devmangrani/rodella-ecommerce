# Use Node.js 20 with Alpine (includes bash)
FROM node:20-alpine

# Install bash and other necessary tools
RUN apk add --no-cache bash

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Install a simple HTTP server for serving static files
RUN npm install -g serve

# Expose port
EXPOSE 3000

# Command to serve the built files
CMD ["serve", "-s", "dist", "-l", "3000"] 