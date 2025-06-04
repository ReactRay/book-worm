import { Stack, useSegments, useRouter } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from '../components/SafeScreen';
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from '../store/authStore'
import { useEffect, useState } from "react";

export default function RootLayout() {

  const router = useRouter()
  const segments = useSegments()

  const [isReady, setIsReady] = useState(false)

  const { checkAuth, user, token } = useAuthStore()


  useEffect(() => {
    checkAuth().finally(() => setIsReady(true))
  }, [])

  // handle navigation depending on auth state
  useEffect(() => {
    if (!isReady) return
    const inAuthScreen = segments[0] === '(auth)'
    const isSignedIn = user && token

    if (!isSignedIn && !inAuthScreen) {
      router.replace('/(auth)')
    }
    else if (isSignedIn && inAuthScreen) {
      router.replace('/(tabs)')

    }
  }, [user, token, segments])


  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{ headerShown: false }} >
          <Stack.Screen name='(tabs)' />
          <Stack.Screen name='(auth)' />
        </Stack>
      </SafeScreen>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}