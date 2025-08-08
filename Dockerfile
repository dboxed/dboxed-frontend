FROM node:24 AS build
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

# nginx
FROM nginxinc/nginx-unprivileged:1.27.0-alpine

COPY --chown=nginx --from=build /app/dist /www
COPY nginx.conf /etc/nginx/conf.d/default.conf

ADD run.sh /run.sh

CMD ["/run.sh"]
