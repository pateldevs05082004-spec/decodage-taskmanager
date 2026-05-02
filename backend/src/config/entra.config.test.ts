import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  getEntraConfig,
  getAuthorizationUrl,
  isEntraConfigured,
  getEntraConfigForLogging,
  clearConfigCache,
} from './entra.config';

describe('Entra ID Configuration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset environment before each test
    process.env = { ...originalEnv };
    clearConfigCache();
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
    clearConfigCache();
  });

  describe('getEntraConfig', () => {
    it('should load configuration from environment variables', () => {
      process.env.ENTRA_CLIENT_ID = 'test-client-id';
      process.env.ENTRA_CLIENT_SECRET = 'test-client-secret';
      process.env.ENTRA_TENANT_ID = 'test-tenant-id';
      process.env.ENTRA_REDIRECT_URI = 'http://localhost:3000/auth/callback';

      const config = getEntraConfig();

      expect(config.clientId).toBe('test-client-id');
      expect(config.clientSecret).toBe('test-client-secret');
      expect(config.tenantId).toBe('test-tenant-id');
      expect(config.redirectUri).toBe('http://localhost:3000/auth/callback');
    });

    it('should construct correct authorization endpoint', () => {
      process.env.ENTRA_CLIENT_ID = 'test-client-id';
      process.env.ENTRA_CLIENT_SECRET = 'test-client-secret';
      process.env.ENTRA_TENANT_ID = 'test-tenant-id';
      process.env.ENTRA_REDIRECT_URI = 'http://localhost:3000/auth/callback';

      const config = getEntraConfig();

      expect(config.authorizationEndpoint).toBe(
        'https://login.microsoftonline.com/test-tenant-id/oauth2/v2.0/authorize'
      );
    });

    it('should construct correct token endpoint', () => {
      process.env.ENTRA_CLIENT_ID = 'test-client-id';
      process.env.ENTRA_CLIENT_SECRET = 'test-client-secret';
      process.env.ENTRA_TENANT_ID = 'test-tenant-id';
      process.env.ENTRA_REDIRECT_URI = 'http://localhost:3000/auth/callback';

      const config = getEntraConfig();

      expect(config.tokenEndpoint).toBe(
        'https://login.microsoftonline.com/test-tenant-id/oauth2/v2.0/token'
      );
    });

    it('should include default scopes', () => {
      process.env.ENTRA_CLIENT_ID = 'test-client-id';
      process.env.ENTRA_CLIENT_SECRET = 'test-client-secret';
      process.env.ENTRA_TENANT_ID = 'test-tenant-id';
      process.env.ENTRA_REDIRECT_URI = 'http://localhost:3000/auth/callback';

      const config = getEntraConfig();

      expect(config.scopes).toEqual(['openid', 'profile', 'email', 'offline_access']);
    });

    it('should throw error when ENTRA_CLIENT_ID is missing', () => {
      process.env.ENTRA_CLIENT_SECRET = 'test-client-secret';
      process.env.ENTRA_TENANT_ID = 'test-tenant-id';
      process.env.ENTRA_REDIRECT_URI = 'http://localhost:3000/auth/callback';

      expect(() => getEntraConfig()).toThrow(/ENTRA_CLIENT_ID/);
    });

    it('should throw error when ENTRA_CLIENT_SECRET is missing', () => {
      process.env.ENTRA_CLIENT_ID = 'test-client-id';
      process.env.ENTRA_TENANT_ID = 'test-tenant-id';
      process.env.ENTRA_REDIRECT_URI = 'http://localhost:3000/auth/callback';

      expect(() => getEntraConfig()).toThrow(/ENTRA_CLIENT_SECRET/);
    });

    it('should throw error when ENTRA_TENANT_ID is missing', () => {
      process.env.ENTRA_CLIENT_ID = 'test-client-id';
      process.env.ENTRA_CLIENT_SECRET = 'test-client-secret';
      process.env.ENTRA_REDIRECT_URI = 'http://localhost:3000/auth/callback';

      expect(() => getEntraConfig()).toThrow(/ENTRA_TENANT_ID/);
    });

    it('should throw error when ENTRA_REDIRECT_URI is missing', () => {
      process.env.ENTRA_CLIENT_ID = 'test-client-id';
      process.env.ENTRA_CLIENT_SECRET = 'test-client-secret';
      process.env.ENTRA_TENANT_ID = 'test-tenant-id';

      expect(() => getEntraConfig()).toThrow(/ENTRA_REDIRECT_URI/);
    });

    it('should throw error listing all missing variables', () => {
      expect(() => getEntraConfig()).toThrow(/ENTRA_CLIENT_ID.*ENTRA_CLIENT_SECRET.*ENTRA_TENANT_ID.*ENTRA_REDIRECT_URI/);
    });
  });

  describe('getAuthorizationUrl', () => {
    beforeEach(() => {
      process.env.ENTRA_CLIENT_ID = 'test-client-id';
      process.env.ENTRA_CLIENT_SECRET = 'test-client-secret';
      process.env.ENTRA_TENANT_ID = 'test-tenant-id';
      process.env.ENTRA_REDIRECT_URI = 'http://localhost:3000/auth/callback';
    });

    it('should generate valid authorization URL with state', () => {
      const state = 'random-state-value';
      const url = getAuthorizationUrl(state);

      expect(url).toContain('https://login.microsoftonline.com/test-tenant-id/oauth2/v2.0/authorize');
      expect(url).toContain('client_id=test-client-id');
      expect(url).toContain('response_type=code');
      expect(url).toContain('redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fcallback');
      expect(url).toContain('state=random-state-value');
      expect(url).toContain('scope=openid+profile+email+offline_access');
    });

    it('should include PKCE parameters when code challenge is provided', () => {
      const state = 'random-state-value';
      const codeChallenge = 'test-code-challenge';
      const url = getAuthorizationUrl(state, codeChallenge);

      expect(url).toContain('code_challenge=test-code-challenge');
      expect(url).toContain('code_challenge_method=S256');
    });

    it('should not include PKCE parameters when code challenge is not provided', () => {
      const state = 'random-state-value';
      const url = getAuthorizationUrl(state);

      expect(url).not.toContain('code_challenge');
      expect(url).not.toContain('code_challenge_method');
    });
  });

  describe('isEntraConfigured', () => {
    it('should return true when all variables are set', () => {
      process.env.ENTRA_CLIENT_ID = 'test-client-id';
      process.env.ENTRA_CLIENT_SECRET = 'test-client-secret';
      process.env.ENTRA_TENANT_ID = 'test-tenant-id';
      process.env.ENTRA_REDIRECT_URI = 'http://localhost:3000/auth/callback';

      expect(isEntraConfigured()).toBe(true);
    });

    it('should return false when any variable is missing', () => {
      process.env.ENTRA_CLIENT_ID = 'test-client-id';
      // Missing other variables

      expect(isEntraConfigured()).toBe(false);
    });

    it('should return false when no variables are set', () => {
      expect(isEntraConfigured()).toBe(false);
    });
  });

  describe('getEntraConfigForLogging', () => {
    it('should mask client secret in logging output', () => {
      process.env.ENTRA_CLIENT_ID = 'test-client-id';
      process.env.ENTRA_CLIENT_SECRET = 'very-long-secret-value-12345';
      process.env.ENTRA_TENANT_ID = 'test-tenant-id';
      process.env.ENTRA_REDIRECT_URI = 'http://localhost:3000/auth/callback';

      const logConfig = getEntraConfigForLogging();

      expect(logConfig.clientSecret).toBe('very...2345');
      expect(logConfig.clientSecret).not.toContain('very-long-secret-value-12345');
    });

    it('should include non-sensitive configuration values', () => {
      process.env.ENTRA_CLIENT_ID = 'test-client-id';
      process.env.ENTRA_CLIENT_SECRET = 'test-secret';
      process.env.ENTRA_TENANT_ID = 'test-tenant-id';
      process.env.ENTRA_REDIRECT_URI = 'http://localhost:3000/auth/callback';

      const logConfig = getEntraConfigForLogging();

      expect(logConfig.clientId).toBe('test-client-id');
      expect(logConfig.tenantId).toBe('test-tenant-id');
      expect(logConfig.redirectUri).toBe('http://localhost:3000/auth/callback');
    });

    it('should return NOT_CONFIGURED when configuration is missing', () => {
      const logConfig = getEntraConfigForLogging();

      expect(logConfig.clientId).toBe('NOT_CONFIGURED');
    });
  });
});
