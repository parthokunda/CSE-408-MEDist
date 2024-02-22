FROM node:20-alpine

WORKDIR /app/proxy

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]