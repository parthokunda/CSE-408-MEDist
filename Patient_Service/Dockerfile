FROM node:20-alpine

WORKDIR /app/Patient_Service

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3003

CMD ["npm", "start"]