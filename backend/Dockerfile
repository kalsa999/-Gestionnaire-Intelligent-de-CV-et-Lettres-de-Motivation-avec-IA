# 1. The principle that we will serve (Node.js LTS) FROM node:24-slim
FROM node:24-slim

# 2. Installing OpenSSL (very important for Prisma to serve on Linux within Docker) RUN apt-get update -y && apt-get install -y openssl
RUN apt-get update -y && apt-get install -y openssl

# 3. Specify the path where the code will be placed inside the Container
WORKDIR /usr/src/app

# 4. Transfer the packages files first so we can install (this makes the build fast) COPY package*.json./ COPY 
COPY package*.json ./
COPY prisma ./prisma/

# 5. Install packages (Dependencies) RUN npm install 
RUN npm install

# 6. Transfer the rest of the project code COPY. .
COPY . .

# 7. Generate Prisma Client inside Container RUN npx prisma generate
RUN npx prisma generate

# 8. The port in which the backend will be used EXPOSE 3000
EXPOSE 3000

# 9. It's up to me to play the back end CMD ["npm", "start"]
CMD ["npm", "start"]
