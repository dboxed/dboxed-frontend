#!/usr/bin/env sh

(
  cd /www/assets
  ls -lah
  for i in $(ls env-*.js); do
    envsubst < $i > $i.tmp
    diff $i $i.tmp
    mv $i.tmp $i
  done
)

exec nginx -g 'daemon off;'
