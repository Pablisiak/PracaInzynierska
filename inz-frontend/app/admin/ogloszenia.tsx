import { Text, View, FlatList, StyleSheet, TouchableOpacity, TextInput, Button, Alert, RefreshControl } from "react-native";
import pobierzOgloszenia from "../svfunctions/pobierzogloszenia";
import { useState, useEffect } from "react";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Ogloszenia() {
  const [ogloszenia, setOgloszenia] = useState<any[]>([]);
  const [editing, setEditing] = useState(false);
  const [adding, setAdding] = useState(false);
  const [currentOgloszenie, setCurrentOgloszenie] = useState<any>(null);
  const [newOgloszenie, setNewOgloszenie] = useState<any>({ tytul: "", opis: "" });
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await pobierzOgloszenia(); 
      setOgloszenia(data); 
    };

    fetchData();
  }, []);

  const handleAdd = () => {
    setAdding(true);
    setEditing(false);
    setNewOgloszenie({ tytul: "", opis: "" });
  };

  const handleCancelAdd = () => {
    setAdding(false);
    setNewOgloszenie({ tytul: "", opis: "" });
  };

  const handleSaveNewOgloszenie = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post('http://192.168.111.109:3000/dodajogloszenie', newOgloszenie, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await pobierzOgloszenia(); 
      setOgloszenia(data);
      setAdding(false);
      setNewOgloszenie({ tytul: "", opis: "" });
      Alert.alert("Sukces", "Ogłoszenie zostało dodane pomyślnie.");
    } catch (error) {
      console.error('Błąd podczas dodawania ogłoszenia:', error);
      Alert.alert("Błąd", "Nie udało się dodać ogłoszenia.");
    }
  };

  const handleEdit = (item: any) => {
    setAdding(false);
    setCurrentOgloszenie(item);
    setEditing(true);
  };

  const handleUpdate = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.put('http://192.168.111.109:3000/edytujogloszenie', currentOgloszenie, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }); 
      setEditing(false);
      setOgloszenia(ogloszenia.map(ogloszenie => 
        ogloszenie.id === currentOgloszenie.id ? currentOgloszenie : ogloszenie
      ));
    } catch (error) {
      console.error('Błąd podczas aktualizacji ogłoszenia:', error);
    }
  };

  const handleUsuniecieOgloszenia = async (id: any) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.post('http://192.168.111.109:3000/usunogloszenie', {id}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const nowaListaOgloszen = await pobierzOgloszenia();
      Alert.alert("Usunięcie ogłoszenia", "Ogłoszenie zostało usunięte");
      setOgloszenia(nowaListaOgloszen);
    } catch (error) {
      console.error('Błąd podczas usuwania ogłoszenia:', error);
      Alert.alert("Błąd", "Nie udało się usunąć ogłoszenia.");
    }
  }
  const onRefresh = async () => {
    setRefreshing(true);
    const data = await pobierzOgloszenia(); 
    setOgloszenia(data); 
    setRefreshing(false);
      };

  return (
    <View style={styles.container}>
      {adding ? (
        <View style={styles.formContainer}>
          <Text style={styles.tytul}>Dodaj nowe ogłoszenie</Text>
          <TextInput
            style={styles.input}
            value={newOgloszenie.tytul}
            onChangeText={(text) => setNewOgloszenie({ ...newOgloszenie, tytul: text })}
            placeholder="Tytuł"
          />
          <TextInput
            style={styles.input}
            value={newOgloszenie.opis}
            onChangeText={(text) => setNewOgloszenie({ ...newOgloszenie, opis: text })}
            placeholder="Opis"
          />
          <TouchableOpacity 
            style={styles.editButton}
            onPress={handleSaveNewOgloszenie}
          >
            <FontAwesome name="check" size={20} color="white" style={{ marginRight: 10 }} />
            <Text style={{ color: 'white' }}>Zapisz ogłoszenie</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={handleCancelAdd}
          >
            <FontAwesome name="remove" size={20} color="white" style={{ marginRight: 10 }} />
            <Text style={{ color: 'white' }}>Anuluj</Text>
          </TouchableOpacity>
        </View>
      ) : editing ? (
        <View style={styles.formContainer}>
          <Text style={styles.tytul}>Edytowanie ogłoszenia</Text>
          <TextInput
            style={styles.input}
            value={currentOgloszenie.tytul}
            onChangeText={(text) => setCurrentOgloszenie({ ...currentOgloszenie, tytul: text })}
            placeholder="Tytuł"
          />
          <TextInput
            style={styles.input}
            value={currentOgloszenie.opis}
            onChangeText={(text) => setCurrentOgloszenie({ ...currentOgloszenie, opis: text })}
            placeholder="Opis"
          />
          <TouchableOpacity 
            style={styles.editButton}
            onPress={handleUpdate}
          >
            <FontAwesome name="check" size={20} color="white" style={{ marginRight: 10 }} />
            <Text style={{ color: 'white' }}>Zapisz zmiany</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => setEditing(false)}
          >
            <FontAwesome name="remove" size={20} color="white" style={{ marginRight: 10 }} />
            <Text style={{ color: 'white' }}>Anuluj</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={handleAdd}
          >
            <Text style={{ color: 'white' }}>Dodaj nowe ogłoszenie</Text>
          </TouchableOpacity>
          <FlatList
            data={ogloszenia}
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
              <View style={styles.ogloszenieItem}>
                <Text style={styles.tytul}>{item.tytul}</Text>
                <Text style={styles.opis}>{item.opis}</Text>
                <TouchableOpacity 
                  style={styles.editButton}
                  onPress={() => handleEdit(item)}
                >
                  <FontAwesome name="edit" size={20} color="white" style={{ marginRight: 10 }} />
                  <Text style={{ color: 'white' }}>Edytuj</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => handleUsuniecieOgloszenia(item.id)}
                >
                  <FontAwesome name="trash" size={20} color="white" style={{ marginRight: 10 }} />
                  <Text style={{ color: 'white' }}>Usuń</Text>
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={<Text>Brak ogłoszeń do wyświetlenia</Text>}
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
  ogloszenieItem: {
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
  opis: {
    fontSize: 14,
    color: 'gray',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0000FF',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF0000',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  }
});
