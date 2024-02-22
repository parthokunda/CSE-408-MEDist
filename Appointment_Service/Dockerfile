FROM node:20-alpine

WORKDIR /app/Appointment_Service

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3005

CMD ["npm", "start"]