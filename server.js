const Koa = require('koa');
const fetch = require('node-fetch');
const dotenv = require('dotenv');
const app = new Koa();

dotenv.config();

const PORT = Number(process.env.SERVER_PORT) || 3000;
const APP_NAME = process.env.APP_NAME || 'poc';

app.use(async (ctx) => {
  const path = ctx?.request?.url;
  if (path === '/') {
    console.log('main');
    ctx.body = `Hello world, from ${APP_NAME}`;
    return;
  }

  if (path === '/health') {
    console.log('health');
    ctx.body = `Healthy, from ${APP_NAME}`;
    return;
  }

  if (path === '/special') {
    console.log('special');
    ctx.body = {
      data: `Special route, from ${APP_NAME}`,
    };
    return;
  }

  if (path === '/fetch') {
    // service.namespace.svc.cluster.local
    const serviceName = process.env.SERVICE_NAME;
    const port = process.env.SERVER_PORT;
    const url = `http://${serviceName}.default.svc.cluster.local:${port}/special`;
    const response = await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log('data: ', data);
        return data;
      });
    ctx.body = {
      data: response,
    };
    return;
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
