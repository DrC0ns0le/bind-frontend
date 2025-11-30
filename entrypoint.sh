#!/bin/sh
# Generate config.js at runtime if VITE_* environment variables are present

CONFIG_FILE="/usr/share/nginx/html/config.js"

# Check if any VITE_* environment variables exist
VITE_VARS=$(env | grep '^VITE_')

if [ -n "$VITE_VARS" ]; then
  echo "🔧 Runtime VITE_* variables detected, generating config.js..."

  # Generate config.js with all VITE_* variables
  echo "window.ENV = {" > "$CONFIG_FILE"

  env | grep '^VITE_' | sort | while IFS='=' read -r key value; do
    # Escape single quotes in value
    escaped_value=$(echo "$value" | sed "s/'/\\\\'/g")
    echo "  ${key}: '${escaped_value}'," >> "$CONFIG_FILE"
    echo "  ✓ ${key}"
  done

  echo "};" >> "$CONFIG_FILE"
  echo "✅ config.js generated successfully"
else
  echo "ℹ️  No runtime VITE_* variables found, using build-time values"
fi

# Start nginx
exec nginx -g 'daemon off;'
