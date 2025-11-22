FROM node:18-alpine

WORKDIR /app

# Copy shared utilities first
COPY shared ./shared

# Copy package files
COPY backend-dashboard/package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY backend-dashboard/ .

# Expose port
EXPOSE 5006

# Start application
CMD ["npm", "start"]

