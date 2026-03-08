import Router from 'koa-router';
import { getAppConfig, getSupportedProviders, validateConfig } from '../utils/config.js';

const router = new Router();

interface OAuthRequestBody {
  code: string;
  codeVerifier: string;
  redirectUri: string;
}

/**
 * OAuth Token 端点
 * POST /api/oauth
 */
router.post('/api/oauth', async (ctx) => {
  // 获取请求头中的应用标识
  const appId = ctx.get('X-App-Id');
  const provider = ctx.get('X-OAuth-Provider') || 'github';

  if (!appId) {
    ctx.status = 400;
    ctx.body = { error: 'Missing X-App-Id header' };
    return;
  }

  // 获取请求体
  const { code, codeVerifier, redirectUri } = ctx.request.body as OAuthRequestBody;

  if (!code || !codeVerifier || !redirectUri) {
    ctx.status = 400;
    ctx.body = {
      error: 'Missing required parameters: code, codeVerifier, redirectUri',
    };
    return;
  }

  // 获取应用配置
  const config = getAppConfig(appId, provider);

  if (!config) {
    ctx.status = 404;
    ctx.body = { error: `应用 ${appId} 未配置` };
    return;
  }

  // 验证回调地址
  try {
    validateConfig(config, redirectUri);
  } catch (err: any) {
    ctx.status = 400;
    ctx.body = { error: err.message };
    return;
  }

  // 根据不同提供商构建请求
  const tokenUrl =
    provider === 'gitee'
      ? 'https://gitee.com/oauth/token'
      : 'https://github.com/login/oauth/access_token';

  try {
    // 发送到 OAuth 提供商获取 token
    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: new URLSearchParams({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        code,
        redirect_uri: redirectUri,
        ...(provider === 'github' && codeVerifier ? { code_verifier: codeVerifier } : {}),
      }).toString(),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      ctx.status = 400;
      ctx.body = {
        error: tokenData.error,
        error_description: tokenData.error_description,
      };
      return;
    }

    ctx.status = 200;
    ctx.body = tokenData;
  } catch (err) {
    console.error('OAuth error:', err);
    ctx.status = 500;
    ctx.body = { error: 'Internal server error' };
  }
});

/**
 * 获取支持的提供商列表
 * GET /api/providers
 */
router.get('/api/providers', async (ctx) => {
  const providers = getSupportedProviders();
  ctx.body = { providers };
});

export default router;
