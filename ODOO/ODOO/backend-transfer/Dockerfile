FROM node:18-alpine

WORKDIR /app

# Copy shared utilities first
COPY shared ./shared

# Copy package files
COPY backend-transfer/package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY backend-transfer/ .

# Expose port
EXPOSE 5004

# Start application
CMD ["npm", "start"]

