import { Redirect } from 'expo-router';

// Maps are temporarily disabled while the Android startup crash is investigated.
// import { MapExperience } from '@/components/map-experience';

export default function MapsScreen() {
  // return <MapExperience />;
  return <Redirect href="/skia" />;
}
