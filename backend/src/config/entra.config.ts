/**
 * Microsoft Entra ID Configuration Module
 * 
 * This module loads and validates Microsoft Entra ID (formerly Azure AD) 
 * configuration from environment variables. It provides type-safe access 
 * to authentication settings used throughout the application.
 * 
 * Environment variables required:
 * - ENTRA_CLIENT_ID: Application (client) ID from Azure Portal
 * - ENTRA_CLIENT_SECRET: Client secret value from Azure Portal
 * - ENTRA_TENANT_ID: Directory (tenant) ID from Azure Portal
 * - ENTRA_REDIRECT_URI: OAuth 2.0 redirect URI (must match Azure Portal configuration)
 */

export interface EntraConfig {
  /** Application (client) ID from Azure Portal */
  clientId: string;
  
  /** Client secret value from Azure Portal */
  clientSecret: string;
  
  /** Directory (tenant) ID from Azure Portal */
  tenantId: string;
  
  /** OAuth 2.0 redirect URI for authorization code flow */
  redirectUri: string;
  
  /** Microsoft Entra ID authorization endpoint */
  authorizationEndpoint: string;
  
  /** Microsoft Entra ID token endpoint */
  tokenEndpoint: string;
  
  /** Microsoft Graph API endpoint for user information */
  userInfoEndpoint: string;
  
  /** OAuth 2.0 scopes requested during authentication */
  scopes: string[];
}

/**
 * Validates that all required Entra ID environment variables are present
 * @throws {Error} If any required environment variable is missing
 */
function validateEntraConfig(): void {
  const requiredVars = [
    'ENTRA_CLIENT_ID',
    'ENTRA_CLIENT_SECRET',
    'ENTRA_TENANT_ID',
    'ENTRA_REDIRECT_URI',
  ];

  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required Entra ID environment variables: ${missingVars.join(', ')}\n` +
      'Please ensure your .env file is configured correctly.\n' +
      'See backend/ENTRA_ID_SETUP.md for setup instructions.'
    );
  }
}

/**
 * Loads and returns the Entra ID configuration
 * @throws {Error} If required environment variables are missing
 */
export function getEntraConfig(): EntraConfig {
  validateEntraConfig();

  const tenantId = process.env.ENTRA_TENANT_ID!;
  const clientId = process.env.ENTRA_CLIENT_ID!;
  const clientSecret = process.env.ENTRA_CLIENT_SECRET!;
  const redirectUri = process.env.ENTRA_REDIRECT_URI!;

  return {
    clientId,
    clientSecret,
    tenantId,
    redirectUri,
    
    // Microsoft Entra ID endpoints (v2.0)
    authorizationEndpoint: `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize`,
    tokenEndpoint: `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
    userInfoEndpoint: 'https://graph.microsoft.com/v1.0/me',
    
    // Default scopes for user authentication
    // openid: Required for OpenID Connect
    // profile: Access to user's profile information
    // email: Access to user's email address
    // offline_access: Request refresh token for token renewal
    scopes: ['openid', 'profile', 'email', 'offline_access'],
  };
}

/**
 * Generates the authorization URL for initiating OAuth 2.0 flow
 * @param state - Random state parameter for CSRF protection
 * @param codeChallenge - PKCE code challenge (optional, for enhanced security)
 * @returns Complete authorization URL to redirect user to
 */
export function getAuthorizationUrl(state: string, codeChallenge?: string): string {
  const config = getEntraConfig();
  
  const params = new URLSearchParams({
    client_id: config.clientId,
    response_type: 'code',
    redirect_uri: config.redirectUri,
    response_mode: 'query',
    scope: config.scopes.join(' '),
    state,
  });

  // Add PKCE code challenge if provided (recommended for enhanced security)
  if (codeChallenge) {
    params.append('code_challenge', codeChallenge);
    params.append('code_challenge_method', 'S256');
  }

  return `${config.authorizationEndpoint}?${params.toString()}`;
}

/**
 * Checks if Entra ID configuration is available
 * Useful for conditional feature enabling or graceful degradation
 * @returns true if all required environment variables are set
 */
export function isEntraConfigured(): boolean {
  try {
    validateEntraConfig();
    return true;
  } catch {
    return false;
  }
}

/**
 * Gets a masked version of the configuration for logging purposes
 * Sensitive values (client secret) are partially masked
 * @returns Configuration object safe for logging
 */
export function getEntraConfigForLogging(): Partial<EntraConfig> {
  if (!isEntraConfigured()) {
    return { clientId: 'NOT_CONFIGURED' };
  }

  const config = getEntraConfig();
  
  return {
    clientId: config.clientId,
    tenantId: config.tenantId,
    redirectUri: config.redirectUri,
    clientSecret: config.clientSecret.substring(0, 4) + '...' + config.clientSecret.slice(-4),
    authorizationEndpoint: config.authorizationEndpoint,
    tokenEndpoint: config.tokenEndpoint,
    scopes: config.scopes,
  };
}

// Export a singleton instance for convenience
let cachedConfig: EntraConfig | null = null;

/**
 * Gets the cached Entra ID configuration
 * Configuration is loaded once and cached for subsequent calls
 * @returns Cached EntraConfig instance
 */
export function getCachedEntraConfig(): EntraConfig {
  if (!cachedConfig) {
    cachedConfig = getEntraConfig();
  }
  return cachedConfig;
}

/**
 * Clears the cached configuration
 * Useful for testing or when environment variables change at runtime
 */
export function clearConfigCache(): void {
  cachedConfig = null;
}
