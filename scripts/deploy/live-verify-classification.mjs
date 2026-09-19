export function isBenignNextRscAbort(request, expectedOrigin) {
  try {
    const url = new URL(request.url())
    return url.origin === expectedOrigin
      && request.method() === 'GET'
      && url.searchParams.has('_rsc')
      && !request.isNavigationRequest()
      && request.failure()?.errorText === 'net::ERR_ABORTED'
  } catch {
    return false
  }
}

export function isRetryableSameOriginAssetAbort(request, expectedOrigin) {
  try {
    const url = new URL(request.url())
    const isStaticAsset = url.pathname.startsWith('/_next/static/')
      || url.pathname.startsWith('/fonts/')

    return url.origin === expectedOrigin
      && request.method() === 'GET'
      && isStaticAsset
      && !request.isNavigationRequest()
      && request.failure()?.errorText === 'net::ERR_ABORTED'
  } catch {
    return false
  }
}
