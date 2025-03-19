/**
 * Wrapping route guards as middleware
 */
export function defineMiddleware(name, handler, { router, app } = {}) {
  router.beforeEach((to, from, next) => {
    const middleware = to.meta.middleware || []
    if (!middleware.includes(name)) {
      next()
    }
    else {
      handler(
        {
          ...router,
          beforeEach: func => func(to, from, next),
        },
        { app },
      )
    }
  })
}
