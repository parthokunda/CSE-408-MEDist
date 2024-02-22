FROM node:20-alpine

WORKDIR /app/Doctor_Service

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3004

CMD ["npm", "start"]