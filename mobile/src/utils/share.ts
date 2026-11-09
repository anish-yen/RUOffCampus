export const WEB_BASE_URL = 'https://ruoffcampus.vercel.app';

export function buildListingShareUrl(id: string | number): string {
  return `${WEB_BASE_URL}/listings/${encodeURIComponent(String(id))}`;
}

export function buildListingShareMessage(listing: { id: string; title: string }): string {
  return `${listing.title} - ${buildListingShareUrl(listing.id)}`;
}
