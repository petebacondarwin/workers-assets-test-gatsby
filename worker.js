export default {
  async fetch(req, env) {
    const url = new URL(req.url)

    // Root URL is treated specially
    if (url.pathname === "/") {
      return env.ASSETS.fetch(new Request(new URL("/index.html", url), req))
    }

    // Strip off any trailing slash.
    const urlNoSlash = new URL(url.pathname.replace(/\/$/, ""), url)

    // Try adding .html
    const assetWithExtensionUrl = new URL(urlNoSlash.pathname + ".html", url)
    const assetWithExtension = await env.ASSETS.fetch(
      new Request(assetWithExtensionUrl, req)
    )
    if (assetWithExtension.status === 200) {
      return assetWithExtension
    }

    // Try adding /index.html
    const assetAsDirectoryUrl = new URL(
      urlNoSlash.pathname + "/index.html",
      url
    )
    const assetAsDirectory = await env.ASSETS.fetch(
      new Request(assetAsDirectoryUrl, req)
    )
    if (assetAsDirectory.status === 200) {
      return assetAsDirectory
    }

    // Give up
    return new Response("Not found", { status: 404 })
  },
}
