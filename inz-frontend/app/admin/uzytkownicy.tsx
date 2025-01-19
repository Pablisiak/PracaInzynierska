import React, { useEffect, useState } from "react";
import { FlatList, Text, View, TouchableOpacity, StyleSheet, TextInput, Alert, RefreshControl } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import pobierzUzytkownikow from "../svfunctions/pobierzuzytkownikow";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Uzytkownicy() {
  const [users, setUsers] = useState<any[]>([]);
  const [editing, setEditing] = useState(false);
  const [adding, setAdding] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [newUser, setNewUser] = useState<any>({ imie: "", nazwisko: "" });
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await pobierzUzytkownikow();
      setUsers(data);
    };

    fetchUsers();
  }, []);

  const handleEdit = (user: any) => {
    setCurrentUser(user);
    setEditing(true);
  };

  const handleUpdate = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.put('http://192.168.111.109:3000/zmiendaneklienta', currentUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEditing(false);
      setUsers(users.map((user) => (user.id === currentUser.id ? currentUser : user)));
    } catch (error) {
      console.error('Błąd podczas aktualizacji klienta:', error);
    }
  };

  const handleAddUser = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post('http://192.168.111.109:3000/dodajklienta', newUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { id, kod } = response.data;
      const updatedUsers = await pobierzUzytkownikow();
      setUsers(updatedUsers);
      setNewUser({ imie: "", nazwisko: "" });
      setAdding(false);
      Alert.alert("Dodano klienta", `ID: ${id}\nKod: ${kod}`, [
        { text: "OK", onPress: () => {} },
      ]);
    } catch (error) {
      console.error('Błąd podczas dodawania klienta:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    const data = await pobierzUzytkownikow();
    setUsers(data);
    setRefreshing(false);
      };
    

  return (
    <View style={styles.container}>
      {adding ? (
        <View style={styles.formContainer}>
          <Text style={styles.tytul}>Dodaj nowego klienta</Text>
          <TextInput
            style={styles.input}
            value={newUser.imie}
            onChangeText={(text) => setNewUser({ ...newUser, imie: text })}
            placeholder="Imię"
          />
          <TextInput
            style={styles.input}
            value={newUser.nazwisko}
            onChangeText={(text) => setNewUser({ ...newUser, nazwisko: text })}
            placeholder="Nazwisko"
          />
          <TouchableOpacity style={styles.editButton} onPress={handleAddUser}>
            <FontAwesome name="check" size={20} color="white" style={{ marginRight: 10 }} />
            <Text style={{ color: "white" }}>Dodaj klienta</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => setAdding(false)}>
            <FontAwesome name="remove" size={20} color="white" style={{ marginRight: 10 }} />
            <Text style={{ color: "white" }}>Anuluj</Text>
          </TouchableOpacity>
        </View>
      ) : editing ? (
        <View style={styles.formContainer}>
          <Text style={styles.tytul}>Edycja klienta</Text>
          <TextInput
            style={styles.input}
            value={currentUser.imie}
            onChangeText={(text) => setCurrentUser({ ...currentUser, imie: text })}
            placeholder="Imię"
          />
          <TextInput
            style={styles.input}
            value={currentUser.nazwisko}
            onChangeText={(text) => setCurrentUser({ ...currentUser, nazwisko: text })}
            placeholder="Nazwisko"
          />
          <TextInput
            style={styles.input}
            value={currentUser.kod}
            onChangeText={(text) => setCurrentUser({ ...currentUser, kod: text })}
            placeholder="Kod"
          />
          <TouchableOpacity style={styles.editButton} onPress={handleUpdate}>
            <FontAwesome name="check" size={20} color="white" style={{ marginRight: 10 }} />
            <Text style={{ color: "white" }}>Zapisz zmiany</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => setEditing(false)}>
            <FontAwesome name="remove" size={20} color="white" style={{ marginRight: 10 }} />
            <Text style={{ color: "white" }}>Anuluj</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <View style={styles.addNew}>
          <TouchableOpacity style={styles.addButton} onPress={() => setAdding(true)}>
          <FontAwesome name="edit" size={20} color="white" style={{ marginRight: 10 }} />
            <Text style={{ color: "white" }}>Dodaj nowego klienta</Text>
          </TouchableOpacity>
          </View>
          <FlatList
            data={users}
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
                <Text style={styles.tytul}>{item.imie} {item.nazwisko} (ID Klienta: {item.id})</Text>
                <Text style={styles.tytul}>Kod: {item.kod}</Text>
                <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item)}>
                  <FontAwesome name="edit" size={20} color="white" style={{ marginRight: 10 }} />
                  <Text style={{ color: 'white' }}>Edytuj</Text>
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={<Text>Brak klientów do wyświetlenia</Text>}
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4C9900',
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
  addNew: {
    padding: 1,
  },
  tytul: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
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
});
