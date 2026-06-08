FROM node:18
WORKDIR /app
COPY package*.json ./
COPY ./vite.config.ts ./vite.config.ts
RUN npm install
COPY ./src ./src
EXPOSE 3000
CMD ["npm", "run", "dev"]
