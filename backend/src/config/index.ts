/**
 * Configuration Module Exports
 * 
 * Central export point for all configuration modules.
 * This allows clean imports throughout the application:
 * 
 * import { getEntraConfig, getAuthorizationUrl } from './config';
 */

export {
  getEntraConfig,
  getAuthorizationUrl,
  isEntraConfigured,
  getEntraConfigForLogging,
  getCachedEntraConfig,
  clearConfigCache,
  type EntraConfig,
} from './entra.config';
