# Use the official Node.js image as a base
FROM node:12.16.1 AS base

# Set the working directory in the container
WORKDIR /app

# Copy package.json, package-lock.json
COPY package*.json ./

# Copy node_modules directory from the local environment to the Docker container
COPY node_modules ./node_modules

# Build arguments for environment specification
ARG configuration=production

# Install Angular CLI as a devDependency.
RUN npm install -g @angular/cli@8.3.29

# Increase Node.js memory limit for the production environment
ENV NODE_OPTIONS="--max_old_space_size=8192"

# Copy the rest of the application code into the container
COPY . .

# Build the application
RUN ng build --prod

# Use httpd for serving the application
FROM httpd:2.4.51-alpine

# Include .htaccess files in Apache configuration
RUN echo 'IncludeOptional conf.d/*.conf' >> /usr/local/apache2/conf/httpd.conf

# Copy the build output from the base stage
COPY --from=base /app/dist/* /usr/local/apache2/htdocs/

# Copy the .htaccess file into the Apache container
COPY .htaccess /usr/local/apache2/htdocs/

# Expose port 80 for the Apache server
EXPOSE 80

CMD ["httpd", "-D", "FOREGROUND"]