import React, { useEffect, useState } from "react";
import { FlatList, Text, View, TouchableOpacity, StyleSheet, TextInput, Alert, RefreshControl } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AwarieUser() {
  const [awarie, setAwarie] = useState<any[]>([]);
  const [adding, setAdding] = useState(false);
  const [nowaAwaria, setNowaAwaria] = useState<any>({
    komentarz: "",
  });
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchAwarie = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const id = await AsyncStorage.getItem("id_klienta");
        const response = await axios.post("http://192.168.111.109:3000/sprawdzawarieuzytkownika", {id}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAwarie(response.data);
      } catch (error) {
        
      }
    };

    fetchAwarie();
  }, []);

  const handleAddAwaria = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const id = await AsyncStorage.getItem("id_klienta");
      const id_klienta = await AsyncStorage.getItem('id_klienta');
      const idKlientaInt = id_klienta ? parseInt(id_klienta, 10) : 0;
      const response = await axios.post('http://192.168.111.109:3000/dodajawarie', {
        komentarz: nowaAwaria.komentarz,
        id_klienta: idKlientaInt,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedAwarie = await axios.post("http://192.168.111.109:3000/sprawdzawarieuzytkownika", {id}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAwarie(updatedAwarie.data);
      setNowaAwaria({ komentarz: "" });
      setAdding(false);

      Alert.alert("Dodano zgłoszenie awarii", "Zgłoszenie awarii zostało przyjęte do realizacji.");
      
    } catch (error) {
      console.error('Błąd podczas zgłaszania awarii:', error);
      Alert.alert("Błąd", "Nie udało się zgłosić awarii. Spróbuj ponownie później.");
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const id = await AsyncStorage.getItem("id_klienta");
      const response = await axios.post("http://192.168.111.109:3000/sprawdzawarieuzytkownika", {id}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAwarie(response.data);
    } catch (error) {
      
    }
    setRefreshing(false);
      };

  return (
    <View style={styles.container}>
       {adding ? (
        <View style={styles.formContainer}>
          <Text style={styles.tytul}>Zgłoś awarię</Text>
          <TextInput
            style={styles.input}
            value={nowaAwaria.komentarz}
            onChangeText={(text) => setNowaAwaria({ ...nowaAwaria, komentarz: text })}
            placeholder="Treść awarii (Napisz co się dzieje, jaka jest Twoja lokalizacja)"
          />
          <TouchableOpacity style={styles.editButton} onPress={handleAddAwaria}>
            <FontAwesome name="check" size={20} color="white" style={{ marginRight: 10 }} />
            <Text style={{ color: "white" }}>Dodaj zgłoszenie awarii</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => setAdding(false)}>
            <FontAwesome name="remove" size={20} color="white" style={{ marginRight: 10 }} />
            <Text style={{ color: "white" }}>Anuluj</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
        <View style={styles.addNew}>
          <TouchableOpacity style={styles.addButton} onPress={() => setAdding(true)}>
            <FontAwesome name="edit" size={20} color="white" style={{ marginRight: 10 }} />
            <Text style={{ color: "white" }}>Dodaj zgłoszenie awarii</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={awarie}
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
              <Text style={styles.tytul}>ID Awarii: {item.id}</Text>
              <Text style={styles.tytul}>Treść: {item.komentarz}</Text>
              <Text style={styles.tytul}>Odpowiedź administratora: {item.odpowiedz || "Brak odpowiedzi"}</Text>
              <Text style={styles.tytul}>Status: {item.status ? "Zakończone" : "Do ustalenia"}</Text>
        
            </View>
          )}
          ListEmptyComponent={<Text>Brak zgłoszeń awarii do wyświetlenia</Text>}
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
    height: 200,
    textAlignVertical: 'top',
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
  addNew: {
    padding: 1,
  },
});
