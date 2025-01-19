import React, { useEffect, useState } from "react";
import { FlatList, Text, View, TouchableOpacity, StyleSheet, TextInput, Alert, RefreshControl } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Awarie() {
  const [awarie, setAwarie] = useState<any[]>([]);
  const [responseText, setResponseText] = useState<string>("");
  const [selectedAwaria, setSelectedAwaria] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchAwarie = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.get("http://192.168.111.109:3000/sprawdzawarie", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAwarie(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAwarie();
  }, []);

  const handleOdpowiedzAwaria = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.put('http://192.168.111.109:3000/odpowiedznaawarie', {
        id: selectedAwaria.id,
        odpowiedz: responseText,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAwarie(awarie.map((awaria) =>
        awaria.id === selectedAwaria.id
          ? { ...awaria, odpowiedz: responseText, status: true }
          : awaria
      ));

      setResponseText("");
      setSelectedAwaria(null);
      Alert.alert("Awaria rozwiązana", "Status awarii został ustawiony na rozwiązany.");

    } catch (error) {
      console.error('Błąd podczas odpowiadania na awarię:', error);
      Alert.alert("Błąd", "Nie udało się odpowiedzieć na awarię.");
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get("http://192.168.111.109:3000/sprawdzawarie", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAwarie(response.data);
    } catch (error) {
      console.log(error);
    }
    setRefreshing(false);
      };

  return (
    <View style={styles.container}>
      {selectedAwaria ? (
        <View style={styles.formContainer}>
          <Text style={styles.tytul}>Odpowiedz na awarię {selectedAwaria.id}</Text>
          <TextInput
            style={styles.input}
            value={responseText}
            onChangeText={setResponseText}
            placeholder="Wpisz odpowiedź"
            multiline
          />
          <TouchableOpacity style={styles.editButton} onPress={handleOdpowiedzAwaria}>
            <FontAwesome name="check" size={20} color="white" style={{ marginRight: 10 }} />
            <Text style={{ color: "white" }}>Wyślij odpowiedź</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => setSelectedAwaria(null)}>
            <FontAwesome name="remove" size={20} color="white" style={{ marginRight: 10 }} />
            <Text style={{ color: "white" }}>Anuluj</Text>
          </TouchableOpacity>
        </View>
      ) : (
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
              <Text style={styles.tytul}>Awaria {item.id} - ID Klienta: {item.id_klienta}</Text>
              <Text style={styles.tytul}>Komentarz: {item.komentarz}</Text>
              <Text style={styles.tytul}>Odpowiedź: {item.odpowiedz || "Brak odpowiedzi"}</Text>
              <Text style={styles.tytul}>Status: {item.status ? "Rozwiązana" : "Do rozwiązania"}</Text>
              {!item.status && (
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => setSelectedAwaria(item)}
                >
                  <FontAwesome name="edit" size={20} color="white" style={{ marginRight: 10 }} />
                  <Text style={{ color: "white" }}>Odpowiedz na awarię</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          ListEmptyComponent={<Text>Brak awarii do wyświetlenia</Text>}
          contentContainerStyle={{ paddingBottom: 200 }}
        />
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
});
