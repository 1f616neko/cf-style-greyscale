export default {
    async fetch(request, env, ctx) {
        // Fetch the original response from origin
        const response = await fetch(request);

        // Get the URL and check if it should be excluded
        const url = new URL(request.url);
        const pathname = url.pathname.toLowerCase();
        const excludedExtensions = [".png", ".jpg", ".pdf", ".gif", ".tiff"];
        const isExcludedPath = url.hostname.toLowerCase() === "bugs.1f616emo.xyz" &&
                               pathname.startsWith("/diffusion/tpgfd/") &&
                               excludedExtensions.some(ext => pathname.endsWith(ext));

        // Get the Content-Type header
        const contentType = response.headers.get("content-type") || "";

        // Only rewrite if it's HTML and not excluded
        if (contentType.includes("text/html") && !isExcludedPath) {
            return new HTMLRewriter()
                .on("head", {
                    element(el) {
                        el.append(`<style>body{-webkit-filter:grayscale(1);filter:grayscale(1);}</style>`, { html: true });
                    }
                })
                .transform(response);
        }

        // Otherwise, return the response untouched
        return response;
    }
}