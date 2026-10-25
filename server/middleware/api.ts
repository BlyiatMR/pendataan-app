export default defineEventHandler((event) => {
  if (!event.path.startsWith('/api/')) return
  setResponseHeaders(event, { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' })
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(event.method)) {
    const origin = getRequestHeader(event, 'origin')
    if (origin && origin !== getRequestURL(event).origin) {
      throw createError({ statusCode: 403, message: 'Asal permintaan tidak diizinkan.' })
    }
    if (Number(getRequestHeader(event, 'content-length') || 0) > 3 * 1024 * 1024) {
      throw createError({ statusCode: 413, message: 'Permintaan terlalu besar.' })
    }
  }
})
