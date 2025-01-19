import axios, { AxiosError } from 'axios';

const rejestracja = async (id: string, kod: string, email: string, login: string, haslo: string) => {
  try {
    const data = {
      id,
      kod,
      email,
      login,
      haslo,
    };

    const response = await axios.post('http://192.168.111.109:3000/register', data);

    if (response.data.status === "ok") {
      return { success: true, message: response.data.info };
    } else {
      return { success: false, message: response.data.info };
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { success: false, message: error.response?.data.info || "Nieznany błąd" };
    } else {
      console.error("Inny błąd:", error);
      return { success: false, message: "Wystąpił problem z rejestracją" };
    }
  }
};
export default rejestracja;
