# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.13.1
FROM node:${NODE_VERSION}-slim AS base
WORKDIR /app

# Install dependencies (production only)
RUN --mount=type=cache,target=/root/.npm \
    --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    npm ci --production

# Copy application files (excluding .env, .git, lock files, etc.)
COPY --link . .

# Create a non-root user
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

# Expose the ports used by the app (HTTP and HTTPS)
EXPOSE 3001 3443

# Set environment variables
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Set permissions for uploads and certs directories
RUN mkdir -p /app/uploads /app/certs && \
    chown -R appuser:appgroup /app/uploads /app/certs

USER appuser

CMD ["npm", "start"]
