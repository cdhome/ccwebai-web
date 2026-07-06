FROM node:20-alpine AS builder

WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV PORT=3001

RUN apk add --no-cache libc6-compat \
  && corepack enable \
  && corepack prepare pnpm@9.0.0 --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod=false

COPY --from=builder /app/dist ./dist
COPY api ./api
COPY shared ./shared
COPY scripts ./scripts
COPY .env.example ./.env.example
COPY docker-start.sh ./docker-start.sh

RUN chmod +x /app/docker-start.sh

EXPOSE 3001

CMD ["./docker-start.sh"]
