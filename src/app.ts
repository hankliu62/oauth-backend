import cors from '@koa/cors';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import Router from 'koa-router';
import oauthRouter from './routes/oauth.js';

const app = new Koa();

// 中间件
app.use(
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'X-App-Id', 'X-OAuth-Provider', 'X-Requested-With', 'Accept', 'Origin'],
    exposeHeaders: ['Content-Length', 'Date', 'X-Request-Id'],
    credentials: true,
    maxAge: 86400,
  })
);

app.use(bodyParser());

// 路由
const router = new Router();
router.get('/api/health', (ctx) => {
  ctx.body = { status: 'ok', timestamp: new Date().toISOString() };
});

app.use(router.routes());
app.use(router.allowedMethods());
app.use(oauthRouter.routes());
app.use(oauthRouter.allowedMethods());

export default app;
