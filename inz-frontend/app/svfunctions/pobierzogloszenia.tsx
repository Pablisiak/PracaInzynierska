import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const pobierzOgloszenia = async () => {
  try {
    //console.log("pobieram dane ogłoszeń")
    const token = await AsyncStorage.getItem('token');
    const response = await axios.get('http://192.168.111.109:3000/ogloszenia', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    //console.log(response.data)
    return response.data;
  } catch (error) {
    return [];
  }
};
export default pobierzOgloszenia;