import React, { useEffect, useState } from "react";
import { FlatList, Text, View, TouchableOpacity, StyleSheet, TextInput, Alert, RefreshControl } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Faktury() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [adding, setAdding] = useState(false);
  const [newInvoice, setNewInvoice] = useState<any>({
    id_klienta: "",
    kwota: "",
    zuzycie: "",
  });
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const response = await axios.get("http://192.168.111.109:3000/wszystkiefaktury", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setInvoices(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchInvoices();
  }, []);

  const handleAddInvoice = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.post('http://192.168.111.109:3000/dodajfakture', {
        ...newInvoice,
        data_wystawienia: new Date().toISOString(),
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedInvoices = await axios.get("http://192.168.111.109:3000/wszystkiefaktury", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setInvoices(updatedInvoices.data);
      setNewInvoice({ id_klienta: "", kwota: "", zuzycie: "" });
      setAdding(false);

      Alert.alert("Dodano fakturę", "Faktura została dodana pomyślnie.");
      
    } catch (error) {
      console.error('Błąd podczas dodawania faktury:', error);
      Alert.alert("Błąd", "Nie udało się dodać faktury.");
    }
  };

  const handleChangeStatus = async (id: number) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.put("http://192.168.111.109:3000/fakturazaplacona", { id }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setInvoices(invoices.map((invoice) =>
        invoice.id === id
          ? { ...invoice, status_oplacenia: response.data.nowy_status }
          : invoice
      ));

      Alert.alert("Zmieniono status płatności", `Status płatności: ${response.data.nowy_status ? "Opłacona" : "Nieopłacona"}`);
    } catch (error) {
      console.error("Błąd podczas zmiany statusu płatności:", error);
      Alert.alert("Błąd", "Nie udało się zmienić statusu płatności.");
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get("http://192.168.111.109:3000/wszystkiefaktury", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setInvoices(response.data);
    } catch (error) {
      console.log(error);
    }
    setRefreshing(false);
      };

  return (
    <View style={styles.container}>
      {adding ? (
        <View style={styles.formContainer}>
          <Text style={styles.tytul}>Dodaj nową fakturę</Text>
          <TextInput
            style={styles.input}
            value={newInvoice.id_klienta}
            onChangeText={(text) => setNewInvoice({ ...newInvoice, id_klienta: text })}
            placeholder="ID Klienta"
          />
          <TextInput
            style={styles.input}
            value={newInvoice.kwota}
            onChangeText={(text) => setNewInvoice({ ...newInvoice, kwota: text })}
            placeholder="Kwota"
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            value={newInvoice.zuzycie}
            onChangeText={(text) => setNewInvoice({ ...newInvoice, zuzycie: text })}
            placeholder="Zużycie"
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.editButton} onPress={handleAddInvoice}>
            <FontAwesome name="check" size={20} color="white" style={{ marginRight: 10 }} />
            <Text style={{ color: "white" }}>Dodaj fakturę</Text>
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
              <Text style={{ color: "white" }}>Dodaj nową fakturę</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={invoices}
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
                <Text style={styles.tytul}>Faktura {item.id} - ID Klienta: {item.id_klienta}</Text>
                <Text style={styles.tytul}>Kwota: {item.kwota} zł</Text>
                <Text style={styles.tytul}>Zużycie: {item.zuzycie} m³</Text>
                <Text style={styles.tytul}>Data wystawienia: {new Date(item.data_wystawienia).toLocaleDateString()}</Text>
                <Text style={styles.tytul}>Status płatności: {item.status_oplacenia ? "Opłacona" : "Nieopłacona"}</Text>
                <TouchableOpacity style={styles.editButton} onPress={() => handleChangeStatus(item.id)}>
                  <FontAwesome name="refresh" size={20} color="white" style={{ marginRight: 10 }} />
                  <Text style={{ color: "white" }}>Zmień status płatności</Text>
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={<Text>Brak faktur do wyświetlenia</Text>}
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
