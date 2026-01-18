import { z } from 'zod';
import { insertGoalSchema, insertDailyFocusSchema, goals, resources, dailyFocus } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

export const api = {
  goals: {
    list: {
      method: 'GET' as const,
      path: '/api/goals',
      input: z.object({
        category: z.string().optional(),
        isCompleted: z.enum(['true', 'false']).optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof goals.$inferSelect>()),
        401: errorSchemas.unauthorized,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/goals',
      input: insertGoalSchema,
      responses: {
        201: z.custom<typeof goals.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/goals/:id',
      input: insertGoalSchema.partial(),
      responses: {
        200: z.custom<typeof goals.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/goals/:id',
      responses: {
        204: z.void(),
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      },
    },
  },
  resources: {
    list: {
      method: 'GET' as const,
      path: '/api/resources',
      input: z.object({
        category: z.string().optional(),
        type: z.string().optional(),
        search: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof resources.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/resources/:id',
      responses: {
        200: z.custom<typeof resources.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  dailyFocus: {
    getToday: {
      method: 'GET' as const,
      path: '/api/daily-focus/today',
      responses: {
        200: z.custom<typeof dailyFocus.$inferSelect>().nullable(), // Can be null if not set yet
        401: errorSchemas.unauthorized,
      },
    },
    upsert: {
      method: 'POST' as const,
      path: '/api/daily-focus',
      input: insertDailyFocusSchema,
      responses: {
        200: z.custom<typeof dailyFocus.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
