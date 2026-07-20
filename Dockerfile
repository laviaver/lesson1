# ============================================
# STAGE 1 — Dependencies
# Install ALL dependencies including devDependencies
# This stage is used for building only — it never ships to production
# ============================================
FROM node:20-alpine AS deps

# Create and set the working directory inside the container
# All subsequent commands run from here
WORKDIR /app

# Copy package files first — before copying your source code
# WHY: Docker caches each layer. If package.json hasn't changed,
# Docker reuses the cached npm install layer even if your code changed.
# This makes rebuilds dramatically faster.
COPY package*.json ./

# Install all dependencies including devDependencies
RUN npm ci

# ============================================
# STAGE 2 — Production image
# Only contains what's needed to run the app
# ============================================
FROM node:20-alpine AS production

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ONLY production dependencies — no Jest, no Supertest, no nodemon
RUN npm ci --omit=dev

# Copy your application source code
COPY . .

# The port your Express app listens on
# EXPOSE documents the port — it doesn't actually publish it
# Publishing happens in docker-compose.yml
EXPOSE 3000

# Default command — can be overridden in docker-compose.yml
# This is what runs when the container starts
CMD ["node", "server.js"]