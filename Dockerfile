FROM node:19
WORKDIR /app
COPY ./package.json ./package.json
COPY  . .
RUN npm install
EXPOSE 5001
CMD ["npm","start"]