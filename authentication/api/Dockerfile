FROM node:18-slim

COPY mysql.js mysql.js
COPY package*.json ./

RUN npm install

# To run on production
RUN npm ci --only=production

CMD ["node", "mysql.js"]