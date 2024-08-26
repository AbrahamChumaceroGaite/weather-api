FROM node:18

# Create app directory
WORKDIR /app/

COPY package.json package-lock.json ./

RUN npm install

RUN npm install pm2 -g

EXPOSE 80

COPY . .
CMD ["pm2-runtime", "app.js"]
