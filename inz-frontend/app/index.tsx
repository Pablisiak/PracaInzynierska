import { Text, View, Image, StyleSheet, TextInput, Pressable } from "react-native";
import { Link } from "expo-router";
import getStatus from "./svfunctions/status";
import { useEffect, useState } from "react";
import handleLogin from "./svfunctions/login";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const router = useRouter();
  const [login, setLogin] = useState('');
  const [haslo, setHaslo] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const onLoginPress = () => {
    handleLogin({login, haslo, setError, setIsLoggedIn});
  }
  const [status, setStatus] = useState('Ładowanie...');
  useEffect(() => {
    const getSVStatus = async () => {
      const data = await getStatus();
      setStatus(data.status);
    }
    const checkRoleAndRedirect = async () => {
      const role = await AsyncStorage.getItem('role');
      if (role) {
        if (role === 'admin') {
          router.replace('./admin');
        } else if (role === 'user') {
          router.replace('./user');
        }
      }
    };
    getSVStatus();
    if(isLoggedIn){
      checkRoleAndRedirect();
    }
  }, [isLoggedIn, router]);
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
      alignItems: "center"
    },
    forgotPassword: {
      color: "blue",
    },
  });

  return (
    <View style={style.fullview}>
      <View style={style.contentView}>
      <Image style={style.logo} source={require('../assets/images/logo.png')} />
      <Text>Logowanie</Text>
      <TextInput style={style.textinput} value={login} onChangeText={setLogin} placeholder="Login" />
      <TextInput secureTextEntry style={style.textinput} value={haslo} onChangeText={setHaslo} placeholder="Hasło" />
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      <View style={style.buttonview}>
      <Pressable onPress={onLoginPress} style={style.loginButton}><Text style={style.buttonText}>Logowanie</Text></Pressable>
      <Link push href="/register" asChild><Pressable style={style.registerButton}><Text style={style.buttonText}>Rejestracja</Text></Pressable></Link>
      </View>

      </View>
      <View style={style.bottomView}><Text>Status usługi: {status}</Text></View>
    </View>
  );
}
