import { Redirect, useLocalSearchParams } from 'expo-router';

import { buildListingDeepLinkTarget } from '@/src/utils/share';

// Inbound web share links use the plural /listings/<id> route (ruoffcampus.vercel.app).
// The native detail screen lives at /listing/[id]; redirect so deep links land there.
export default function ListingShareRedirect() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <Redirect href={buildListingDeepLinkTarget(String(id ?? ''))} />;
}
