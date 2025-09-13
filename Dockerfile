# Etapa 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Instal·lar dependències
COPY package*.json ./
RUN npm install

# Copiar el codi
COPY . .

# Generar build per SSR
RUN npm run build

# Etapa 2: Runner
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4321
ENV HOST=0.0.0.0

# Copiar només el necessari del build i dependències de producció
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 4321

# Comanda per arrencar SSR
CMD ["node", "./dist/server/entry.mjs"]