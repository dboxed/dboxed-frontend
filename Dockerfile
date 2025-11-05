FROM node:24-alpine AS build
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app
COPY *.json *.yaml /app/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

COPY . /app
RUN pnpm run build

# nginx
FROM nginxinc/nginx-unprivileged:1.27.0-alpine

COPY --chown=nginx --from=build /app/dist /www
COPY nginx.conf /etc/nginx/conf.d/default.conf

ADD run.sh /run.sh

CMD ["/run.sh"]
