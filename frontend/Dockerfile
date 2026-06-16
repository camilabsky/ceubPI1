FROM node:18
WORKDIR /app
COPY package*.json ./
COPY ./vite.config.ts ./
COPY index.html ./
RUN npm install
COPY ./src ./src
EXPOSE 3000
CMD ["npm", "run", "dev"]
