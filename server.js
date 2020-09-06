const Koa = require('koa');
const fetch = require('node-fetch');
const dotenv = require('dotenv');
const app = new Koa();

dotenv.config();

const PORT = Number(process.env.SERVER_PORT) || 3000;
const APP_NAME = process.env.APP_NAME || 'poc';

app.use(async (ctx) => {
  const path = ctx?.request?.url;

  /**
   * Generic test
   */
  if (path === '/') {
    console.log('main');
    ctx.body = `Hello world, from ${APP_NAME}`;
    return;
  }

  /**
   * K8s health check
   */
  if (path === '/health') {
    console.log('health');
    ctx.body = `Healthy, from ${APP_NAME}`;
    return;
  }

  /**
   * Route to test microservices talking to each other
   */
  if (path === '/special') {
    console.log('special');
    ctx.body = {
      data: `Special route, from ${APP_NAME}`,
    };
    return;
  }

  /**
   * Making a request to the other service via K8s DNS
   */
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

  /**
   * Hasura
   */
  async function hasuraGraphqlRequest(query, variables = {}) {
    const headers = {
      'Content-Type': 'application/json',
      'x-hasura-admin-secret': 'password',
    }

    const body = JSON.stringify({
      query,
      variables: variables || null,
    });

    const url = `http://${process.env.HASURA_BASE_URL}/v1/graphql`

    return await fetch(url, {
      method: 'POST',
      headers,
      body,
    })
      .then(stream => stream.json())
  }

  if (path === '/shops') {
    const response = await hasuraGraphqlRequest(
      `
      query MyQuery {
        shop {
          shop_origin
        }
      }
      `
    )

    ctx.body = response
    return;
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
