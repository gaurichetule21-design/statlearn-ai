# Stage 1: Build the client and server bundle
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependency manifests
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# Stage 2: Production runtime
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install production dependencies only
COPY package*.json ./
RUN npm install --omit=dev

# Copy compiled build artifacts from builder stage
COPY --from=builder /app/dist ./dist

EXPOSE 3000

# Start the bundled Express server
CMD ["node", "dist/server.cjs"]