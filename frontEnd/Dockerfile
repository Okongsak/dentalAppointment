FROM node:20

# กำหนด working directory
WORKDIR /app

# copy package.json ก่อนเพื่อ cache npm install
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install --legacy-peer-deps

# copy source code ทั้งหมด
COPY . .

# ป้องกันปัญหา permission เวลา bind mount volumes
RUN mkdir -p /app/node_modules && chown -R node:node /app
USER node

# รัน dev server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
