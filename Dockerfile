FROM node:18 as builder

WORKDIR app

COPY package.* .

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn run build


FROM node:18

WORKDIR /app

COPY --from=builder app/package.* .
COPY --from=builder app/node_modules .
COPY --from=builder app/dist dist/

EXPOSE 2028

CMD ["yarn", "run", "start"]