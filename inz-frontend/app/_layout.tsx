import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RootLayout() {
  const [role, setRole] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const storedRole = await AsyncStorage.getItem('role');
      const storedToken = await AsyncStorage.getItem('token');

      if (storedRole && storedToken) {
        setRole(storedRole);
        setIsLoggedIn(true);
      } else{
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  useEffect(() => {
    if (isLoggedIn && role) {
      if (role === 'admin') {
        router.replace('./admin');
      } else if (role === 'user') {
        router.replace('./user');
      }
    }
  }, [isLoggedIn, role, router]);

  if (!isLoggedIn) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="register" />
      </Stack>
    );
  }

  if (role === 'admin') {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="admin" />
      </Stack>
    );
  }

  if (role === 'user') {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="user" />
      </Stack>
    );
  }

  return null;
}
