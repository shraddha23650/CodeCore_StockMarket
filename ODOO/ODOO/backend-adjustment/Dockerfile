FROM node:18-alpine

WORKDIR /app

# Copy shared utilities first
COPY shared ./shared

# Copy package files
COPY backend-adjustment/package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY backend-adjustment/ .

# Expose port
EXPOSE 5005

# Start application
CMD ["npm", "start"]

