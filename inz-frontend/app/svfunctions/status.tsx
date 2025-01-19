import axios from 'axios';

const getStatus = async () => {
  try {
    const response = await axios.get('http://192.168.111.109:3000', {timeout: 2000});
    return response.data;
  } catch (error) {
    return { status: 'Serwer jest wyłączony lub problem z połączeniem internetowym' };
  }
};
export default getStatus;