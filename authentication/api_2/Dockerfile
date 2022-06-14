FROM node:18-slim

COPY store_files.js store_files.js
COPY package*.json ./

RUN npm install

# To run on production
RUN npm ci --only=production

CMD ["node", "store_files.js"]