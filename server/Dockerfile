# Stage 1: Build
FROM node:18-slim AS builder
WORKDIR /usr/src/app

# Install necessary dependencies
RUN apt-get update -y && apt-get install -y openssl

# Install dependencies and build the project
COPY package*.json ./
RUN npm install
COPY prisma ./prisma
RUN npx prisma generate
COPY . .
RUN npm run build  

# Stage 2: Production
FROM node:18-slim AS production
WORKDIR /usr/src/app

# Install only necessary production dependencies and dumb-init
RUN apt-get update && \
    apt-get install -y dumb-init && \
    rm -rf /var/lib/apt/lists/*

# Copy built files from the builder stage
COPY --from=builder /usr/src/app ./
RUN npm install --omit=dev

# Ensure dumb-init is used as the entrypoint
ENTRYPOINT ["dumb-init", "--"]

# Expose port and set the main command
EXPOSE 4000
CMD ["node", "dist/src/main"]
