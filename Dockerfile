FROM node:18.20 as build
ARG app
WORKDIR /app
COPY . . 

RUN npm install --ignore-scripts &&\
  npm run build ${app}

FROM node:18.20-alpine3.20 as final
ARG app
ENV app=${app}
WORKDIR /app
COPY package.json package-lock.json ./
COPY --from=build /app/dist ./dist

RUN npm ci --production --ignore-scripts --progress=false &&\
  npm rebuild bcrypt

CMD node ./dist/apps/${app}/apps/${app}/src/main.js
