export const WEB_BASE_URL = 'https://ruoffcampus.vercel.app';

export function buildListingShareUrl(id: string | number): string {
  return `${WEB_BASE_URL}/listings/${encodeURIComponent(String(id))}`;
}

export function buildListingShareMessage(listing: { id: string; title: string }): string {
  return `${listing.title} - ${buildListingShareUrl(listing.id)}`;
}

export type ShareContent = { message: string };
export type ShareResult = { shared: true } | { shared: false; fallbackUrl: string };

export async function shareListingLink(
  listing: { id: string; title: string },
  shareImpl: (content: ShareContent) => Promise<unknown>,
): Promise<ShareResult> {
  try {
    await shareImpl({ message: buildListingShareMessage(listing) });
    return { shared: true };
  } catch {
    return { shared: false, fallbackUrl: buildListingShareUrl(listing.id) };
  }
}
