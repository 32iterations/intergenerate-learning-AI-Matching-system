# Multi-stage build for 隔代共學 AI 媒合系統

# Stage 1: Build the server
FROM node:20-alpine AS builder

WORKDIR /app

# Copy server package files
COPY server/package*.json ./server/
RUN cd server && npm ci --only=production

# Copy server source
COPY server/ ./server/

# Build TypeScript
RUN cd server && npm run build

# Stage 2: Production image
FROM node:20-alpine

WORKDIR /app

# Copy built server and dependencies
COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/server/node_modules ./server/node_modules
COPY --from=builder /app/server/package*.json ./server/

# Copy frontend static files
COPY frontend/ ./frontend/

# Set working directory to server
WORKDIR /app/server

# Expose port (will be overridden by PORT env var)
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/images', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the server
CMD ["node", "dist/server.js"]
