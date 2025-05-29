# Development Stage
FROM node:20-bookworm-slim
WORKDIR /app

# Install system dependencies and clean up
RUN apt-get update && \
    apt-get install -y openssl curl && \
    rm -rf /var/lib/apt/lists/*

# Copy package files for dependency installation
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm install

# Copy all source code
COPY . .

# Expose the port the app runs on
EXPOSE 3002

# Start the application in development mode
CMD ["npm", "start"]
