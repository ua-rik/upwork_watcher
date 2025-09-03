#!/bin/sh

# Husky
# v9.0.11

ih() {
  if [ -z "$husky_skip_init" ]; then
    husky_skip_init=1
    . "$0" "$@"
  fi
}
ih "$@"
