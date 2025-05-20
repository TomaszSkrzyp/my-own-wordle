
FROM node:18
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./
RUN npm install 

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on (change if needed)
EXPOSE 5000

# Start the application
CMD ["node", "server.js"]