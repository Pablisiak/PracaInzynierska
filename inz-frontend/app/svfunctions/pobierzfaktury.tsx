import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Dane {
    id: number;
    id_klienta: number;
    status_oplacenia: boolean;
    data_wystawienia: string;
    kwota: number;
    zuzycie: number;
}

const pobierzFaktury = async (): Promise<Dane[]> => {
  try {
    //console.log("próbuję pobrać faktury")
    const token = await AsyncStorage.getItem('token');
    const id = await AsyncStorage.getItem('id_klienta');
    const response = await axios.post('http://192.168.111.109:3000/sprawdzfaktury',
    { id },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const faktury = response.data.map((f: any) => ({
      ...f,
      kwota: parseFloat(f.kwota),
      zuzycie: parseFloat(f.zuzycie)
    }));
    //console.log(faktury)
    return faktury;
  } catch (error) {
    return [];
  }
};
export default pobierzFaktury;