FROM node:20-alpine

WORKDIR /app

# Copy dependency manifests first for build caching
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy backend source files
COPY . .

# Expose backend port
EXPOSE 5000

# Start Node.js server using production start script
CMD ["npm", "start"]
