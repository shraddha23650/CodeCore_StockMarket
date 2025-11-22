FROM node:18-alpine

WORKDIR /app

# Copy shared utilities first
COPY shared ./shared

# Copy package files
COPY backend-products/package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY backend-products/ .

# Expose port
EXPOSE 5001

# Start application
CMD ["npm", "start"]

