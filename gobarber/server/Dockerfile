FROM node:lts-alpine

# Create app directory
WORKDIR /app

# Copying files dependencies
COPY package*.json yarn.lock ./

# Installing dependencies
RUN yarn

# Copying files
COPY . .
