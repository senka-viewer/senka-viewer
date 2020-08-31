FROM node:13.8.0
ADD . /code
WORKDIR /code
RUN  npm install && \
npm run build
CMD ["npm", "start"]
