/**
 * Converts a Google Maps URL, share link, address string, or iframe embed code
 * into a valid iframe src URL for rendering inside Google Maps embeds without iframe errors.
 */
export function getMapEmbedUrl(mapsLink?: string, address?: string): string {
  const rawLink = (mapsLink || "").trim();
  const rawAddress = (address || "").trim();

  if (rawLink) {
    // If the user pasted a full <iframe> HTML snippet, extract the src attribute
    const iframeMatch = rawLink.match(/src=["']([^"']+)["']/i);
    if (iframeMatch && iframeMatch[1]) {
      return iframeMatch[1];
    }

    // If it's already an embed URL (Google Maps embed with /embed or pb= or OpenStreetMap embed)
    if (
      rawLink.includes("output=embed") ||
      rawLink.includes("/embed") ||
      rawLink.includes("embed.html") ||
      rawLink.includes("google.com/maps/embed")
    ) {
      return rawLink;
    }

    // Short links (like maps.app.goo.gl or goo.gl/maps) cannot be passed directly into q= as a URL
    // without triggering Google Maps "custom on-map content could not be displayed" error.
    // If address is available, embed by address.
    const isShortLink = /goo\.gl/i.test(rawLink);
    if (isShortLink) {
      if (rawAddress) {
        return `https://maps.google.com/maps?q=${encodeURIComponent(rawAddress)}&output=embed`;
      }
      return `https://maps.google.com/maps?q=DATAZONe&output=embed`;
    }

    // Otherwise, embed search query
    return `https://maps.google.com/maps?q=${encodeURIComponent(rawLink)}&output=embed`;
  }

  if (rawAddress) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(rawAddress)}&output=embed`;
  }

  return "https://maps.google.com/maps?q=DATAZONe&output=embed";
}

/**
 * Returns a direct URL to open the exact location on Google Maps in a new tab when clicked.
 */
export function getMapClickUrl(mapsLink?: string, address?: string): string | undefined {
  const rawLink = (mapsLink || "").trim();
  const rawAddress = (address || "").trim();

  if (rawLink) {
    const iframeMatch = rawLink.match(/src=["']([^"']+)["']/i);
    if (iframeMatch && iframeMatch[1]) {
      return iframeMatch[1];
    }
    if (/^https?:\/\//i.test(rawLink)) {
      return rawLink;
    }
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(rawLink)}`;
  }

  if (rawAddress) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(rawAddress)}`;
  }

  return undefined;
}
