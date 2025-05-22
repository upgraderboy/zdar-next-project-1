# ---------------------------------------------
# 🏗️ Stage 1: Build with Node.js
# ---------------------------------------------
    FROM node:18-alpine AS builder

    WORKDIR /app
    
    COPY . .
    
    RUN npm install --legacy-peer-deps
    
    RUN npm run build
    
    # ---------------------------------------------
    # 🧼 Stage 2: Run with Bun
    # ---------------------------------------------
    FROM oven/bun:1.1.0 AS runner
    
    WORKDIR /app
    
    # Copy from Node.js build
    COPY --from=builder /app/.next/standalone ./
    COPY --from=builder /app/.next/static ./.next/static
    COPY --from=builder /app/public ./public
    
    # Remove node_modules from build (optional)
    RUN rm -rf node_modules
    
    # Install prod deps with Bun
    RUN bun install --production
    
    EXPOSE 3000
    
    CMD ["bun", "server.js"]
