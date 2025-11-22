FROM node:18-alpine

WORKDIR /app

# Copy shared utilities first
COPY shared ./shared

# Copy package files
COPY backend-receipt/package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY backend-receipt/ .

# Expose port
EXPOSE 5002

# Start application
CMD ["npm", "start"]

