# Stage 1: Build Frontend
FROM node:20-alpine AS build-frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Final Image
FROM node:20-alpine
ENV NODE_ENV=production
WORKDIR /app

# Copy backend
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install --production

# Copy backend source
COPY backend/ .

# Copy built frontend from Stage 1
COPY --from=build-frontend /app/frontend/dist /app/frontend/dist

WORKDIR /app/backend
EXPOSE 5000
CMD ["node", "src/index.js"]
