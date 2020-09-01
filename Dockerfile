FROM node:13.8.0-alpine as build
ADD . /code
WORKDIR /code
RUN apk add --no-cache --virtual .build-deps \
    gcc git && \
npm install && \
npm run build

FROM node:13.8.0-alpine
COPY --from=build /code /code
RUN apk add --no-cache --virtual .build-deps git
WORKDIR /code
CMD ["npm", "start"]
