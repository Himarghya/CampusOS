# -----------------------------------------------------------
# Stage 1: Build Frontend Assets
# -----------------------------------------------------------
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# -----------------------------------------------------------
# Stage 2: Build Backend Server
# -----------------------------------------------------------
FROM node:20-alpine AS backend-builder
WORKDIR /app/backend

COPY backend/package*.json ./
COPY backend/prisma ./prisma/
RUN npm install

COPY backend/ ./
RUN npx prisma generate
RUN npm run build

# -----------------------------------------------------------
# Stage 3: Production Full-Stack Runner
# -----------------------------------------------------------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=10000
ENV DATABASE_URL="file:./dev.db"

# Setup backend app
WORKDIR /app/backend
COPY backend/package*.json ./
COPY backend/prisma ./prisma/

RUN npm install --only=production
RUN npx prisma generate

# Copy built backend code and seed database
COPY --from=backend-builder /app/backend/dist ./dist
RUN npx prisma db push --accept-data-loss

# Copy built frontend code so Express serves it
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

# Expose Render standard port
EXPOSE 10000

CMD ["node", "dist/server.js"]
