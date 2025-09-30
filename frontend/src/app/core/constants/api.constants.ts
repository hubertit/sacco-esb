export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/authenticate',
    REFRESH: '/auth/refreshToken'
  },
  USERS: {
    BASE: 'user',
    ALL: 'user/all',
    BY_ID: 'user/id',
    BY_USERNAME: 'user/username',
    BY_ROLE: 'user/Role',
    BY_TYPE: 'user/roleType',
    SAVE: 'user/save',
    UPDATE: 'user/update'
  },
  DASHBOARD: {
    BASE: 'dashboard',
    COUNT_PULL: 'dashboard/countPull',
    COUNT_PUSH: 'dashboard/countPush',
    COUNT_INTERNAL: 'dashboard/countInternal',
    COUNT_TRANSACTIONS: 'dashboard/countTransactions'
  },
  LOGS: {
    BASE: 'logs',
    FILTER_PULL: 'logs/filterPull',
    FILTER_PUSH: 'logs/filterPush',
    FILTER_INTERNAL: 'logs/filterInternal'
  },
  PARTNERS: {
    BASE: 'general-logs',
    ALL: 'general-logs/partners',
    BY_ID: 'general-logs/partner'
  },
  INTEGRATION_LOGS: {
    BASE: '/api/general-logs',
    PARTNER_LOGS: '/api/general-logs/partner'
  },
  ENTITIES: {
    BASE: 'ent',
    ALL: 'ent/entities',
    BY_ID: 'ent/getentity',
    CONTRACTS: 'ent/getcontracts',
    CONTRACT: 'ent/getcontract',
    ADD: 'ent/addentity'
  },
  ROLES: {
    BASE: 'role',
    ALL: 'role/all-roles',
    BY_ID: 'role/id',
    BY_TYPE: 'role/type',
    SAVE: 'role/save',
    UPDATE: 'role/update'
  }
} as const;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  CURRENT_USER: 'current_user',
  LANGUAGE: 'language',
  ACCOUNT: 'account'
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
} as const;
