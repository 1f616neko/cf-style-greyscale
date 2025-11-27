export default {
    async fetch(request, env, ctx) {
        // Fetch the original response from origin
        const response = await fetch(request);

        // Get the Content-Type header
        const contentType = response.headers.get("content-type") || "";

        // Only rewrite if it's HTML
        if (contentType.includes("text/html")) {
            return new HTMLRewriter()
                .on("head", {
                    element(el) {
                        el.append(`<style>body { filter: grayscale(1); }</style>`, { html: true });
                    }
                })
                .transform(response);
        }

        // Otherwise, return the response untouched
        return response;
    }
}