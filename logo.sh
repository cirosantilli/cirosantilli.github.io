#!/usr/bin/env bash
# We convert to PNG because each browser uses a slightly
# different font size for the SVG. Just great.
convert -resize 400x340 logo.svg logo.png
