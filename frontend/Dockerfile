FROM node:20-alpine

WORKDIR /app

COPY package*.json /app/
RUN npm install

COPY . /app

EXPOSE 5173

# With bind mounts, `node_modules` from the image can be hidden.
# Install once on startup if missing.
CMD ["sh", "-c", "if [ ! -d node_modules ]; then npm install; fi && npm run dev -- --host 0.0.0.0 --port 5173"]
