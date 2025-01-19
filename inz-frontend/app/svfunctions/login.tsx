import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LoginResponse {
  status: string;
  token: string;
  czy_admin: boolean;
  id: string;
  id_klienta: string;
  imie: string;
  nazwisko: string;
  email: string;
}

interface HandleLoginProps {
  login: string;
  haslo: string;
  setError: (message: string) => void;
  setIsLoggedIn: (status: boolean) => void;
}

const handleLogin = async ({ login, haslo, setError, setIsLoggedIn }: HandleLoginProps) => {
  try {
    //console.log("wykonuję próbę logowania")
    const response = await axios.post<LoginResponse>('http://192.168.111.109:3000/login', { login, haslo });

    if (response.data.status === 'ok') {
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('role', response.data.czy_admin ? 'admin' : 'user');
      await AsyncStorage.setItem('id_konta', response.data.id.toString());
      await AsyncStorage.setItem('id_klienta', response.data.id_klienta.toString());
      await AsyncStorage.setItem('imie', response.data.imie);
      await AsyncStorage.setItem('nazwisko', response.data.nazwisko);
      await AsyncStorage.setItem('email', response.data.email);
      setIsLoggedIn(true);
    //console.log("pomyślnie zalogowano")
    } else {
      setError('Nieprawidłowy login lub hasło');
    }
  } catch (error) {
    setError('Błąd podczas logowania. Spróbuj ponownie.');
    console.error(error);
  }
};
export default handleLogin;