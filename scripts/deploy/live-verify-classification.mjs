export function isBenignNextRscAbort(request, expectedOrigin) {
  try {
    const url = new URL(request.url())
    return url.origin === expectedOrigin
      && request.method() === 'GET'
      && url.searchParams.has('_rsc')
      && request.resourceType() === 'fetch'
      && !request.isNavigationRequest()
      && request.failure()?.errorText === 'net::ERR_ABORTED'
  } catch {
    return false
  }
}
