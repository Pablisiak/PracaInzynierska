import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const pobierzUzytkownikow = async () => {
  try {
    //console.log("pobieram dane klientów")
    const token = await AsyncStorage.getItem('token');
    const response = await axios.get('http://192.168.111.109:3000/klienci', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    //console.log("zakończyłem pobieranie danych klientów")
    return response.data;
  } catch (error) {
    console.error("Błąd podczas pobierania użytkowników:", error);
    return [];
  }
};
export default pobierzUzytkownikow;
