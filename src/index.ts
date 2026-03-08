import app from './app';

// 本地开发服务器
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Dev server running at http://localhost:${PORT}`);
  });
}

// Vercel Serverless 导出
export default app.callback();
