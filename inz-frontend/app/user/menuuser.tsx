import { Text, ScrollView, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function MenuUser() {
    const router = useRouter();
    const [imie, setImie] = useState<string | null>(null);
    const [nazwisko, setNazwisko] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [id_konta, setId_konta] = useState<string | null>(null);
    const [id_klienta, setId_klienta] = useState<string | null>(null);

    const getUserInfo = async () => {
        const imie = await AsyncStorage.getItem('imie');
        const nazwisko = await AsyncStorage.getItem('nazwisko');
        const email = await AsyncStorage.getItem('email');
        const id_konta = await AsyncStorage.getItem('id_konta');
        const id_klienta = await AsyncStorage.getItem('id_klienta');
        setImie(imie);
        setNazwisko(nazwisko);
        setEmail(email);
        setId_konta(id_konta);
        setId_klienta(id_klienta);
      };
    
      useEffect(() => {
        getUserInfo();  
      }, []);

    const handleLogout = async () => {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('role');
        router.replace('/');
      };
  return (
    <ScrollView style={{ padding: 20 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <FontAwesome name="key" size={20} color="black" style={{ marginRight: 10 }} />
        <Text>Zalogowano jako: {imie} {nazwisko}</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <FontAwesome name="envelope" size={20} color="black" style={{ marginRight: 10 }} />
        <Text>E-Mail: {email}</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <FontAwesome name="id-card" size={20} color="black" style={{ marginRight: 10 }} />
        <Text>Twoje ID Konta: {id_konta}</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <FontAwesome name="address-card" size={20} color="black" style={{ marginRight: 10 }} />
        <Text>Twoje ID Klienta: {id_klienta}</Text>
      </View>
      <TouchableOpacity 
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#FF0000',
          padding: 10,
          borderRadius: 5,
          marginBottom: 20,
        }}
        onPress={handleLogout}
      >
        <FontAwesome name="sign-out" size={20} color="white" style={{ marginRight: 10 }} />
        <Text style={{ color: 'white' }}>Wyloguj się</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}