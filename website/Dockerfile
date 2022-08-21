FROM node:alpine

RUN mkdir -p /app

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

COPY . .

EXPOSE 3000

# CMD ["ls", "views"]
CMD ["npm", "start"]
