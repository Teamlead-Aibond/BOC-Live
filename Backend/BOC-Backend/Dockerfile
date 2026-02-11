# Step 1: Use the official Node.js version 16 image as the base
FROM node:16.17.0
# Install puppeteer dependencies
RUN apt-get update \
    && apt-get install -y ca-certificates fonts-liberation libappindicator3-1 libasound2 libatk-bridge2.0-0 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 libglib2.0-0 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 lsb-release wget xdg-utils
# Step 2: Set the working directory to /app
WORKDIR /app
# Step 3: Copy package.json and package-lock.json files to the working directory
COPY package*.json ./
# Step 4: Install the application's dependencies using npm
RUN npm install
# Step 4.1: Install PM2 globally for production
RUN npm install -g pm2
# Step 5: Copy the rest of the application files to the working directory
COPY . .
# Step 6: Expose port 3000 for the application to listen on
EXPOSE 3000
# Step 7: Set the APP_ENV build argument with a default value of "localhost"
ARG APP_ENV=localhost
ENV APP_ENV=${APP_ENV}
# Step 8: Start the Node.js application using the appropriate command based on the environment
CMD if [ "${APP_ENV}" = "production" ]; then \
pm2-runtime start ecosystem.config.js; \
else \
npm run start; \ 
fi