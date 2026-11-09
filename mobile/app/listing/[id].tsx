import { useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Alert, Image, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';

import { useAppData } from '@/src/context/app-context';
import { shareListingLink } from '@/src/utils/share';

export default function ListingDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { listings, loading, isFavorited, toggleFavorite, deleteListing, userId, canWriteListings, refreshListings } = useAppData();
  const listing = listings.find((item) => item.id === id);
  const [shareFallbackUrl, setShareFallbackUrl] = useState<string | null>(null);
  const [requestedListing, setRequestedListing] = useState(false);

  // Cold deep links can land here before the index tab ever mounted and
  // triggered the first listings fetch - make sure the data loads.
  useEffect(() => {
    if (!listing && !requestedListing) {
      setRequestedListing(true);
      void refreshListings();
    }
  }, [listing, requestedListing, refreshListings]);

  if (!listing) {
    if (loading) {
      return (
        <View style={styles.centered}>
          <Text style={styles.meta}>Loading listing...</Text>
        </View>
      );
    }
    return (
      <View style={styles.centered}>
        <Text style={styles.title}>Listing not found</Text>
        <Pressable
          onPress={() => {
            void refreshListings();
          }}
          style={styles.sharePill}>
          <Text style={styles.shareText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  const favorite = isFavorited(listing.id);
  const canDelete = Boolean(canWriteListings && userId && listing.host_id && listing.host_id === userId);

  const onShare = async () => {
    const result = await shareListingLink(listing, (content) => Share.share(content));
    setShareFallbackUrl(result.shared ? null : result.fallbackUrl);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Image
        source={{ uri: listing.image_url || 'https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1200&q=80' }}
        style={styles.cover}
      />

      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={styles.title}>{listing.title}</Text>
          <View style={styles.actionsRow}>
            <Pressable
              onPress={() => {
                void toggleFavorite(listing.id);
              }}
              style={styles.favoritePill}>
              <Text style={favorite ? styles.favoriteOn : styles.favoriteOff}>{favorite ? '♥ Saved' : '♡ Save'}</Text>
            </Pressable>
            <Pressable onPress={() => {
              void onShare();
            }} style={styles.sharePill}>
              <Text style={styles.shareText}>Share</Text>
            </Pressable>
          </View>
        </View>
        {shareFallbackUrl ? (
          <Text style={styles.shareFallback} selectable>{shareFallbackUrl}</Text>
        ) : null}

        <Text style={styles.price}>${listing.price}/month</Text>
        <Text style={styles.meta}>{listing.beds} bed • {listing.propertyType} • {listing.distance} mi</Text>
        <Text style={styles.meta}>{listing.campus_location || 'Rutgers area'}</Text>

        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{listing.description || 'No description provided yet.'}</Text>

        {canDelete ? (
          <Pressable
            onPress={() => {
              void deleteListing(listing.id)
                .then(() => router.replace('/'))
                .catch((error) => {
                  Alert.alert('Delete failed', error instanceof Error ? error.message : 'Could not delete listing.');
                });
            }}
            style={styles.deleteButton}>
            <Text style={styles.deleteText}>Delete listing</Text>
          </Pressable>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f8fafc' },
  content: { paddingBottom: 20 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' },
  cover: { height: 260, width: '100%' },
  card: {
    marginTop: -24,
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    gap: 8,
  },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  title: { fontSize: 24, fontWeight: '700', color: '#0f172a', flex: 1 },
  price: { fontSize: 20, fontWeight: '700', color: '#cc0033' },
  meta: { fontSize: 14, color: '#475569' },
  sectionTitle: { marginTop: 8, fontSize: 16, fontWeight: '700', color: '#0f172a' },
  description: { color: '#334155', lineHeight: 21 },
  actionsRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  favoritePill: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  favoriteOn: { color: '#cc0033', fontWeight: '700' },
  favoriteOff: { color: '#64748b', fontWeight: '700' },
  sharePill: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  shareText: { color: '#64748b', fontWeight: '700' },
  shareFallback: { marginTop: 8, fontSize: 13, color: '#64748b' },
  deleteButton: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#fecaca',
    backgroundColor: '#fef2f2',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 10,
  },
  deleteText: { color: '#b91c1c', fontWeight: '700' },
});
