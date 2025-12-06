# Build stage
FROM node:20-alpine AS builder

# Version argument (passed during build)
ARG VERSION=latest

# Image metadata (visible on Docker Hub)
LABEL org.opencontainers.image.title="NoteSynth"
LABEL org.opencontainers.image.description="Generate AI-powered markdown notes from Udemy course captions using Gemini API"
LABEL org.opencontainers.image.documentation="https://github.com/YOUR_USERNAME/NoteSynth#docker"
LABEL org.opencontainers.image.source="https://github.com/YOUR_USERNAME/NoteSynth"
LABEL org.opencontainers.image.version="${VERSION}"

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the Next.js application
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Environment variable documentation (visible in docker inspect)
# Users MUST provide GEMINI_API_KEY at runtime
ENV NODE_ENV=production
# GEMINI_API_KEY - Required: Your Gemini API key from https://aistudio.google.com/apikey

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built assets from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set correct permissions
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose the port Next.js runs on
EXPOSE 3000

# Set hostname to listen on all interfaces
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

# Start the application
CMD ["node", "server.js"]

