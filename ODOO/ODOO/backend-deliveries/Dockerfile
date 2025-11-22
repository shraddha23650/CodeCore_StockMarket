FROM node:18-alpine

WORKDIR /app

# Copy shared utilities first
COPY shared ./shared

# Copy package files
COPY backend-deliveries/package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY backend-deliveries/ .

# Expose port
EXPOSE 5003

# Start application
CMD ["npm", "start"]

