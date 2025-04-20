FROM node:22

RUN npm install -g npm pm2

WORKDIR /app

COPY ./package.json .
COPY ./package-lock.json .

RUN npm install
COPY . .

RUN npx prisma generate
RUN npm run build

# CMD ["node", "deploy/app.bundle.js", "--mode production --stage prod --subdomain dom --is-deploy"]
# CMD ["pm2-runtime", "deploy/app.bundle.js --mode production --stage prod --subdomain dom --is-deploy"]
  