declare module '@vercel/koa' {
  import { Middleware } from 'koa';
  export function install(app: any): Middleware;
}
