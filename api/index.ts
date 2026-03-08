import app from '../src/app.js';

// 只有在非 Vercel 环境下才启动本地服务器
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Dev server running at http://localhost:${PORT}`);
  });
}

// Vercel Serverless 导出：必须直接导出 callback
export default app.callback();
