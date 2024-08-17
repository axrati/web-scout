FROM ubuntu:22.04

# Set environment variables
ENV DEBIAN_FRONTEND=noninteractive

# Install necessary dependencies
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    gnupg \
    ca-certificates \
    --no-install-recommends

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean

# Install Puppeteer dependencies
RUN apt-get install -y \
    libnss3 \
    libxss1 \
    fonts-liberation \
    libappindicator3-1 \
    xdg-utils \
    libatk-bridge2.0-0 \
    libgtk-3-0 \
    --no-install-recommends

# Create a working directory for the project
WORKDIR /usr/src/app

# Copy the project files from the 'src' directory into the container
COPY app/ .


# Install project dependencies
RUN npm install

# Install Puppeteer
RUN npm install puppeteer
RUN npx puppeteer browsers install chrome

RUN apt-get install -y libnss3 libxss1 libasound2 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxcomposite1 libxrandr2 libgbm1 libpango-1.0-0 libpangocairo-1.0-0