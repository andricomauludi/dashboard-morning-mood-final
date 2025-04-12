FROM node:16

WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Build arg for environment file
ARG ENV_FILE
ENV ENV_FILE=${ENV_FILE}

COPY . .
EXPOSE 3000
CMD npm start