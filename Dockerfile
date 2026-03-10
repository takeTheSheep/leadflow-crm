FROM node:20-bookworm-slim AS app

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

COPY package.json package-lock.json ./
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl ca-certificates && rm -rf /var/lib/apt/lists/*
RUN npm ci --include=dev

COPY . .

RUN npx prisma generate
RUN npm run build

RUN sed -i 's/\r$//' /app/docker/entrypoint.sh && chmod +x /app/docker/entrypoint.sh

ENV NODE_ENV=production

EXPOSE 3000

ENTRYPOINT ["/app/docker/entrypoint.sh"]
CMD ["npm", "run", "start"]
