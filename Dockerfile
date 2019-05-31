FROM mhart/alpine-node

ENV PRISMA_ENDPOINT=http://xxx:4466\
  PRISMA_SECRET=xxx\
  PRISMA_MANAGEMENT_API_SECRET=xxx\
  PRISMA_APP_SECRET=xxx\
  NODE_ENV=production\
  PRISMA_MANAGEMENT_API_SECRET=xxx

WORKDIR /root
COPY . .
RUN yarn install &&\
  yarn global add typescript pandora &&\
  yarn build

CMD ["yarn", "pandora"]