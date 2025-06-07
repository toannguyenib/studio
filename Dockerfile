# --- Stage 1: Build the Next.js application ---
FROM node:20-alpine as builder

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package.json yarn.lock* package-lock.json* ./

# Install dependencies
RUN \
    if [ -f "yarn.lock" ]; then yarn install --frozen-lockfile; \
    elif [ -f "package-lock.json" ]; then npm ci; \
    else npm install; \
    fi

# Copy the rest of the application code
COPY . .

# Build the Next.js application
# This command depends on your package.json scripts.
# Typically, 'npm run build' or 'yarn build'
RUN npm run build


# --- Stage 2: Create the production-ready image ---
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy the built application from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# If you have custom server.js, copy it
# COPY --from=builder /app/server.js ./server.js

# Expose the port Next.js listens on (default 3000)
EXPOSE 3000

# Command to run the application
# This command depends on your package.json scripts.
# Typically, 'npm start' or 'yarn start'
CMD ["npm", "start"]