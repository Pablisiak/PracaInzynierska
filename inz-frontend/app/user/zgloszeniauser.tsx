import React, { useEffect, useState } from "react";
import { FlatList, Text, View, TouchableOpacity, StyleSheet, TextInput, Alert, RefreshControl } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ZgloszeniaUser() {
  const [zgloszenia, setZgloszenia] = useState<any[]>([]);
  const [stanLicznika, setStanLicznika] = useState(false);
  const [adding, setAdding] = useState(false);
  const [noweZgloszenie, setNoweZgloszenie] = useState<any>({
    stan: "",
  });
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchZgloszenia = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const id = await AsyncStorage.getItem("id_klienta");
        const response = await axios.post("http://192.168.111.109:3000/sprawdzzgloszeniauzytkownika", {id}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setZgloszenia(response.data);
      } catch (error) {
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

  const handleAddZgloszenie = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const id = await AsyncStorage.getItem("id_klienta");
      const id_klienta = await AsyncStorage.getItem('id_klienta');
      const idKlientaInt = id_klienta ? parseInt(id_klienta, 10) : 0;
      const stanNumeric = parseFloat(noweZgloszenie.stan);
      if (isNaN(stanNumeric)) {
        Alert.alert("Błąd", "Proszę wprowadzić prawidłową wartość liczbową dla stanu zużycia (np 123.45).");
        return;
      }
      const response = await axios.post('http://192.168.111.109:3000/dodajzgloszenie', {
        stan: noweZgloszenie.stan,
        id_klienta: idKlientaInt,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedZgloszenia = await axios.post("http://192.168.111.109:3000/sprawdzzgloszeniauzytkownika", {id}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setZgloszenia(updatedZgloszenia.data);
      setNoweZgloszenie({ stan: "" });
      setAdding(false);

      Alert.alert("Dodano zgłoszenie stanu", "Zgłoszenie stanu zostało przyjęte do realizacji.");
      
    } catch (error) {
      console.error('Błąd podczas zgłaszania stanu:', error);
      Alert.alert("Błąd", "Nie udało się zgłosić stanu. Spróbuj ponownie później.");
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const id = await AsyncStorage.getItem("id_klienta");
      const response = await axios.post("http://192.168.111.109:3000/sprawdzzgloszeniauzytkownika", {id}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setZgloszenia(response.data);
    } catch (error) {
    }
    setRefreshing(false);
      };

  return (
    <View style={styles.container}>
       {adding ? (
        <View style={styles.formContainer}>
          <Text style={styles.tytul}>Zgłoś stan zużycia wody</Text>
          <TextInput
            style={styles.input}
            value={noweZgloszenie.stan}
            onChangeText={(text) => setNoweZgloszenie({ ...noweZgloszenie, stan: text })}
            placeholder="Stan zużycia (np. 25.22)"
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.editButton} onPress={handleAddZgloszenie}>
            <FontAwesome name="check" size={20} color="white" style={{ marginRight: 10 }} />
            <Text style={{ color: "white" }}>Dodaj zgłoszenie stanu</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => setAdding(false)}>
            <FontAwesome name="remove" size={20} color="white" style={{ marginRight: 10 }} />
            <Text style={{ color: "white" }}>Anuluj</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
        <View style={styles.addNew}>
        <Text>Aktualny stan możliwości zgłaszania stanu licznika: {stanLicznika ? "Włączony" : "Wyłączony"}</Text>
          <TouchableOpacity style={[styles.addButton, !stanLicznika && styles.disabledButton]} onPress={() => setAdding(true)} disabled={!stanLicznika}>
            <FontAwesome name="edit" size={20} color="white" style={{ marginRight: 10 }} />
            <Text style={{ color: "white" }}>Dodaj nowe zgłoszenie</Text>
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
              <Text style={styles.tytul}>Zgłoszenie nr: {item.id}</Text>
              <Text style={styles.tytul}>Stan: {item.stan}</Text>
              <Text style={styles.tytul}>Odpowiedź administratora: {item.odpowiedz || "Brak odpowiedzi"}</Text>
              <Text style={styles.tytul}>Status: {item.status ? "Zakończone" : "Do ustalenia"}</Text>
        
            </View>
          )}
          ListEmptyComponent={<Text>Brak zgłoszeń do wyświetlenia</Text>}
          contentContainerStyle={{ paddingBottom: 200 }}
        />
    </View>
    )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4C9900',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  disabledButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#808080',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  addNew: {
    padding: 1,
  },
});
