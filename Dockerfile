FROM node:22-alpine AS builder
RUN corepack enable && corepack prepare pnpm@9.15.3 --activate
WORKDIR /app
COPY pnpm-lock.yaml package.json ./
RUN pnpm install --frozen-lockfile

ARG VITE_API_BASE_URL
ARG VITE_APP_BASE_URL
ARG VITE_POSTHOG_KEY
ARG VITE_POSTHOG_HOST
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_APP_BASE_URL=$VITE_APP_BASE_URL
ENV VITE_POSTHOG_KEY=$VITE_POSTHOG_KEY
ENV VITE_POSTHOG_HOST=$VITE_POSTHOG_HOST

COPY . .
RUN pnpm run build

FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
