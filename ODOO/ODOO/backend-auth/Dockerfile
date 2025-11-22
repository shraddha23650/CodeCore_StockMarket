FROM node:18-alpine

WORKDIR /app

# Copy shared utilities first
COPY shared ./shared

# Copy package files
COPY backend-auth/package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY backend-auth/ .

# Expose port
EXPOSE 5000

# Start application
CMD ["npm", "start"]

