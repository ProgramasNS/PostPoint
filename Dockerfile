FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
EXPOSE 8000
CMD ["npx", "tsx", "index.ts"]