export const IntegrationPermission = ['users:create', 'users:read', 'users:update'] as const;

export type TIntegrationPermission = (typeof IntegrationPermission)[number];
