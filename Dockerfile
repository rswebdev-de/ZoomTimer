# STAGE 1: Build the application

FROM node:22-alpine AS builder

WORKDIR /app

# Copy application files
COPY . /app/

# Install dependencies
RUN npm ci

# Build the application
RUN npm run build

# STAGE 2: Create the production image
FROM node:22-alpine

WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./public
COPY --from=builder /app/public ./public
COPY --from=builder /app/server.js ./server.js

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]

