import React, { useEffect, useState } from "react";
import { FlatList, Text, View, TouchableOpacity, StyleSheet, TextInput, Alert, RefreshControl } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Zgloszenia() {
  const [zgloszenia, setZgloszenia] = useState<any[]>([]);
  const [stanLicznika, setStanLicznika] = useState(false);
  const [responseText, setResponseText] = useState<string>("");
  const [selectedZgloszenie, setSelectedZgloszenie] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchZgloszenia = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.get("http://192.168.111.109:3000/sprawdzzgloszenia", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setZgloszenia(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchStatusZglaszania = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.get("http://192.168.111.109:3000/stanlicznika", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const status = response.data[0].stan_licznika;
        setStanLicznika(status);
      } catch (error) {
        console.log(error);
      }  
    }

    fetchZgloszenia();
    fetchStatusZglaszania();
  }, []);

  const handleOdpowiedzZgloszenie = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.put('http://192.168.111.109:3000/odpowiedznazgloszenie', {
        id: selectedZgloszenie.id,
        odpowiedz: responseText,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setZgloszenia(zgloszenia.map((zgloszenie) =>
        zgloszenie.id === selectedZgloszenie.id
          ? { ...zgloszenie, odpowiedz: responseText, status: true }
          : zgloszenie
      ));

      setResponseText("");
      setSelectedZgloszenie(null);
      Alert.alert("Odpowiedziano na zgłoszenie", "Status zgłoszenia został ustawiony na zakończone.");

    } catch (error) {
      console.error('Błąd podczas odpowiadania na zgłoszenie:', error);
      Alert.alert("Błąd", "Nie udało się odpowiedzieć na zgłoszenie.");
    }
  };

  const handleZmianaStanuLicznika = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.post('http://192.168.111.109:3000/zmienstanlicznika', null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const responseNowyStan = await axios.get("http://192.168.111.109:3000/stanlicznika", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const nowystan = responseNowyStan.data[0].stan_licznika;
      const stanTekst = nowystan ? "Włączoną" : "Wyłączoną";
      Alert.alert("Zmieniono możliwość zgłoszeń", "Możliwość zgłoszenia stanu została ustawiona na "+stanTekst);
      setStanLicznika(nowystan);
    } catch (error) {
      console.error('Błąd podczas zmiany możliwości wysyłania zgłoszeń:', error);
      Alert.alert("Błąd", "Nie udało się zmienić możliwości wysyłania zgłoszeń.");
    }
  }

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get("http://192.168.111.109:3000/sprawdzzgloszenia", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setZgloszenia(response.data);
    } catch (error) {
      console.log(error);
    }
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get("http://192.168.111.109:3000/stanlicznika", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const status = response.data[0].stan_licznika;
      setStanLicznika(status);
    } catch (error) {
      console.log(error);
    }  
    setRefreshing(false);
      };

  return (
    <View style={styles.container}>
      {selectedZgloszenie ? (
        <View style={styles.formContainer}>
          <Text style={styles.tytul}>Odpowiedz na zgłoszenie {selectedZgloszenie.id}</Text>
          <TextInput
            style={styles.input}
            value={responseText}
            onChangeText={setResponseText}
            placeholder="Wpisz odpowiedź"
            multiline
          />
          <TouchableOpacity style={styles.editButton} onPress={handleOdpowiedzZgloszenie}>
            <FontAwesome name="check" size={20} color="white" style={{ marginRight: 10 }} />
            <Text style={{ color: "white" }}>Wyślij odpowiedź</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => setSelectedZgloszenie(null)}>
            <FontAwesome name="remove" size={20} color="white" style={{ marginRight: 10 }} />
            <Text style={{ color: "white" }}>Anuluj</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.addNew}>
            <Text>Aktualny stan możliwości zgłaszania stanu licznika: {stanLicznika ? "Włączony" : "Wyłączony"}</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleZmianaStanuLicznika}>
          <FontAwesome name="edit" size={20} color="white" style={{ marginRight: 10 }} />
          <Text style={{ color: "white" }}>Przełącz możliwość zgłoszeń stanu licznika</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={zgloszenia}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['blue']}
              progressBackgroundColor={'black'}
            />
          }
          renderItem={({ item }) => (
            <View style={styles.userItem}>
              <Text style={styles.tytul}>Zgłoszenie {item.id} - ID Klienta: {item.id_klienta}</Text>
              <Text style={styles.tytul}>Stan: {item.stan}</Text>
              <Text style={styles.tytul}>Odpowiedź: {item.odpowiedz || "Brak odpowiedzi"}</Text>
              <Text style={styles.tytul}>Status: {item.status ? "Zakończone" : "Do ustalenia"}</Text>
              {!item.status && (
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => setSelectedZgloszenie(item)}
                >
                  <FontAwesome name="edit" size={20} color="white" style={{ marginRight: 10 }} />
                  <Text style={{ color: "white" }}>Odpowiedz na zgłoszenie</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          ListEmptyComponent={<Text>Brak zgłoszeń do wyświetlenia</Text>}
          contentContainerStyle={{ paddingBottom: 200 }}
        />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  addNew: {
    padding: 1,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4C9900',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  formContainer: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0000FF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF0000',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  userItem: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    marginVertical: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  tytul: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
