FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

RUN npx prisma generate

ENV NODE_ENV=production
ENV DATABASE_URL=$DATABASE_URL

EXPOSE 3000

RUN npm test
CMD ["npm", "start"]
