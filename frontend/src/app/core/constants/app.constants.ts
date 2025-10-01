export const APP_CONFIG = {
  APP_NAME: 'SACCO ESB',
  VERSION: '1.0.0',
  SUPPORTED_LANGUAGES: ['en', 'kin'],
  DEFAULT_LANGUAGE: 'en',
  TOKEN_EXPIRY_BUFFER: 5 * 60 * 1000, // 5 minutes before expiry
  REFRESH_TOKEN_THRESHOLD: 10 * 60 * 1000 // 10 minutes
} as const;

export const USER_ROLES = {
  ADMIN: 'ADMIN',
  USER: 'USER',
  GUEST: 'GUEST'
} as const;

export const USER_TYPES = {
  INTERNAL: 'INTERNAL',
  EXTERNAL: 'EXTERNAL'
} as const;

export const TRANSACTION_TYPES = {
  PULL: 'PULL',
  PUSH: 'PUSH',
  INTERNAL: 'INTERNAL'
} as const;

export const TRANSACTION_STATUS = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  FAILURE: 'FAILURE',
  PROCESSING: 'PROCESSING',
  CANCELLED: 'CANCELLED'
} as const;
