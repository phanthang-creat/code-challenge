FROM oven/bun:1.1.45-alpine AS base
WORKDIR /usr/src/app

FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .
RUN bun run build

FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /usr/src/app/dist/index.js .
COPY --from=prerelease /usr/src/app/package.json .
COPY --from=prerelease /usr/src/app/sequelize sequelize
COPY --from=prerelease /usr/src/app/.sequelizerc .
COPY --from=prerelease /usr/src/app/entrypoint.sh .
RUN chmod +x entrypoint.sh

USER bun
EXPOSE 3000/tcp
ENTRYPOINT ["/usr/src/app/entrypoint.sh"]
CMD ["bun", "index.js"]