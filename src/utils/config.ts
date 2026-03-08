/**
 * OAuth 配置管理
 * 从环境变量读取各应用的配置
 */

export interface AppConfig {
  clientId: string;
  clientSecret: string;
  callbackUrl: string;
}

/**
 * 获取应用配置
 * @param appId - 应用标识
 * @param provider - OAuth 提供商 (github, gitee)
 * @returns 配置对象
 */
export function getAppConfig(appId: string, provider: string = 'github'): AppConfig | null {
  const prefix = `${provider.toUpperCase()}_OAUTH_${appId.toUpperCase()}`;

  const clientId = process.env[`${prefix}_CLIENT_ID`];
  const clientSecret = process.env[`${prefix}_CLIENT_SECRET`];
  const callbackUrl = process.env[`${prefix}_CALLBACK_URL`];

  if (!clientId || !clientSecret || !callbackUrl) {
    return null;
  }

  return {
    clientId,
    clientSecret,
    callbackUrl,
  };
}

/**
 * 获取支持的 OAuth 提供商列表
 */
export function getSupportedProviders(): string[] {
  const providers = new Set<string>();

  Object.keys(process.env).forEach((key) => {
    const match = key.match(/^(\w+)_OAUTH_\w+_CLIENT_ID$/);
    if (match) {
      providers.add(match[1].toLowerCase());
    }
  });

  return Array.from(providers);
}

/**
 * 验证请求配置
 * @param config - 应用配置
 * @param redirectUri - 回调地址
 */
export function validateConfig(config: AppConfig | null, redirectUri: string): void {
  if (!config) {
    throw new Error('应用未配置');
  }

  if (config.callbackUrl !== redirectUri) {
    throw new Error('回调地址不匹配');
  }
}
