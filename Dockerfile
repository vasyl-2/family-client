# Stage 1: Build the Angular application
FROM node:20 AS build

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock) to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install --force

# Copy the Angular application code to the container
COPY . .

# Build the Angular application
RUN npm run build --prod

# Stage 2: Serve the Angular application
FROM nginx:alpine

# Copy the built Angular application from the build stage
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
