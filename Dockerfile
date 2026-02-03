FROM node:18-alpine AS builder

WORKDIR /s-tech

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:18-alpine

WORKDIR /s-tech

COPY --from=builder /s-tech/package*.json ./
COPY --from=builder /s-tech/node_modules ./node_modules
COPY --from=builder /s-tech/dist ./dist

EXPOSE 8078

CMD ["node", "dist/index.js"]
