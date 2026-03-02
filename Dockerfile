# STAGE 1: Build the application
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files first for better layer caching
COPY package.json package-lock.json* ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy source files
COPY . .

# Build the application
RUN npm run build

# STAGE 2: Create the production image
FROM node:22-alpine

WORKDIR /app

# Copy package files and install only production dependencies
COPY --from=builder /app/package.json /app/package-lock.json* ./
RUN npm ci --omit=dev

# Copy built assets and server
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/server.js ./server.js

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]
