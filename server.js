const Koa = require('koa');
const dotenv = require('dotenv');
const app = new Koa();

dotenv.config();

const PORT = Number(process.env.SERVER_PORT) || 3000;
const APP_NAME = process.env.APP_NAME || 'poc';

app.use((ctx) => {
  ctx.body = `Hello world, from ${APP_NAME}`;
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
