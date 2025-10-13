// server/middleware/csurf-bypass.ts
export default defineEventHandler((event) => {
  if (event.path.startsWith('/api/auth')) {
    event.context.skipCsrf = true
  }
})
