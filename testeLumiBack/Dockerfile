FROM node:20.9.0

WORKDIR /app

COPY package.json /app
# COPY package-lock.json /app

RUN npm install --silent

COPY . /app

EXPOSE 8000
CMD [ "npm", "run", "dev" ]