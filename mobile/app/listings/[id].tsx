import { Redirect, useLocalSearchParams } from 'expo-router';

// Inbound web share links use the plural /listings/<id> route (ruoffcampus.vercel.app).
// The native detail screen lives at /listing/[id]; redirect so deep links land there.
export default function ListingShareRedirect() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <Redirect href={{ pathname: '/listing/[id]', params: { id: String(id ?? '') } }} />;
}
