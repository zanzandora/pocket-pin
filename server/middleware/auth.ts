import { getServerSession } from '#auth'

const PUBLIC_ROUTES = new Set(['/', '/sign-in', '/sign-out', '/error'])
// !BUG: Middleware server chặn logic đăng nhập GitHub
// TODO: FIX:Loại trừ các route xác thực khỏi middleware
const AUTH_ROUTES_PREFIX = '/api/auth'

export default defineEventHandler(async (event) => {
  const url = event.node.req.url || '/'
  const pathname = url.split('?')[0]

  // TODO: Thêm điều kiện để bỏ qua các request tĩnh:
  const isStaticAsset = pathname.match(
    /\.(png|jpe?g|gif|svg|webp|ico|css|js|woff2?|ttf|eot)$/,
  )

  if (
    PUBLIC_ROUTES.has(pathname) ||
    pathname.startsWith(AUTH_ROUTES_PREFIX) ||
    isStaticAsset
  )
    return

  let session = null
  try {
    session = await getServerSession(event)
  } catch (err) {
    console.error('Error getting session:', err)
    session = null
  }

  console.warn('session: ', session)
  if (!session) {
    return sendRedirect(event, '/', 302)
  }
})
