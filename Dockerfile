FROM node:18-alpine as BUILD_IMAGE
WORKDIR /app
COPY package.json yarn.lock ./
# install dependencies
RUN yarn install --frozen-lockfile
COPY . .

ARG ENV_FILE=.env
COPY ${ENV_FILE} .env

# build
RUN yarn build

FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV production
COPY --from=BUILD_IMAGE /app/.next/standalone ./standalone
COPY --from=BUILD_IMAGE /app/.next/static ./standalone/.next/static
COPY --from=BUILD_IMAGE /app/public ./standalone/public

EXPOSE 3000
CMD ["node", "./standalone/server.js"]
