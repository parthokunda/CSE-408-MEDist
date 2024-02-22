FROM node:20-alpine

WORKDIR /app/Medicine_Service

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3002

CMD ["npm", "start"]