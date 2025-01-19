import { Text, View, Image, StyleSheet, TextInput, Pressable, Alert } from "react-native";
import { Link } from "expo-router";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useState } from "react";
import rejestracja from "./svfunctions/rejestracja";
import { useRouter } from "expo-router";

export default function Register() {
  const [id, setId] = useState("");  
  const [kod, setKod] = useState("");  
  const [email, setEmail] = useState("");  
  const [login, setLogin] = useState("");  
  const [haslo, setHaslo] = useState("");  
  const [powtorzHaslo, setPowtorzHaslo] = useState("");  
  const [zgoda, setZgoda] = useState(false);  
  const router = useRouter();
  const style = StyleSheet.create({
    logo: {
      width: 200,
      height: 100,
      resizeMode: 'contain',
    },
    fullview: {
      flex: 1,
    },
    buttonview: {
      flexDirection: "row",
    },
    contentView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    textinput: {
      width: '90%',
      margin: 12,
      borderWidth: 1,
      padding: 10,
    },
    loginButton: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
      paddingHorizontal: 10,
      borderRadius: 4,
      elevation: 3,
      backgroundColor: 'blue',
      margin: 5,
    },
    registerButton: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
      paddingHorizontal: 10,
      borderRadius: 4,
      elevation: 3,
      backgroundColor: 'red',
      margin: 5,
    },
    buttonText: {
      fontSize: 16,
      lineHeight: 21,
      fontWeight: 'bold',
      letterSpacing: 0.25,
      color: 'white',
    },
    bottomView: {
      height: 100,
      justifyContent: "center",
      alignItems: "center",
    },
    goBack: {
      color: "blue",
    },
    checkBoxView: {
      flexDirection: "row"
    },
  });

  const handleSubmit = async () => {
    if (haslo !== powtorzHaslo) {
      Alert.alert("Błąd", "Hasła nie są identyczne");
      return;
    }

    if (!zgoda) {
      Alert.alert("Błąd", "Musisz wyrazić zgodę na przetwarzanie danych");
      return;
    }
    const result = await rejestracja(id, kod, email, login, haslo);

    if (result.success) {
      Alert.alert("Konto utworzone", result.message);
      router.push('/');
    } else {
      Alert.alert("Błąd: ", result.message);
    }
  };

  return (
    <View style={style.fullview}>
      <View style={style.contentView}>
      <Image style={style.logo} source={require('../assets/images/logo.png')} />
      <Text>Rejestracja</Text>
      <TextInput style={style.textinput} placeholder="Identyfikator klienta" value={id} onChangeText={setId} />
      <TextInput style={style.textinput} placeholder="Jednorazowy kod rejestracyjny" value={kod} onChangeText={setKod} />
      <TextInput style={style.textinput} placeholder="Adres e-mail" value={email} onChangeText={setEmail} />
      <TextInput style={style.textinput} placeholder="Login" value={login} onChangeText={setLogin} />
      <TextInput secureTextEntry style={style.textinput} placeholder="Hasło" value={haslo} onChangeText={setHaslo} />
      <TextInput secureTextEntry style={style.textinput} placeholder="Powtórz hasło" value={powtorzHaslo} onChangeText={setPowtorzHaslo} />
      <View style={style.checkBoxView}><BouncyCheckbox disableText isChecked={zgoda} onPress={(isChecked: boolean) => setZgoda(isChecked)} /><Text> Wyrażam zgodę na przetwarzanie danych</Text></View>
      <View style={style.buttonview}>
      <Pressable style={style.loginButton} onPress={handleSubmit}><Text style={style.buttonText}>Zarejestruj</Text></Pressable>
      </View>
      <Link push href="/" asChild><Pressable><Text style={style.goBack}>Masz już konto? Przejdź do logowania.</Text></Pressable></Link>
      </View>
      <View style={style.bottomView}><Text>Rejestrując się wyrażasz zgodę na przetwarzanie danych osobowych.</Text></View>
    </View>
  );
}
