import React, { useEffect, useState } from "react";
import { FlatList, Text, View, TouchableOpacity, StyleSheet, TextInput, Alert, RefreshControl } from "react-native";
import pobierzFaktury, { Dane } from "../svfunctions/pobierzfaktury";

export default function FakturyUser() {
  const [faktury, setFaktury] = useState<Dane[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchData = async () => { 
      const danefaktur = await pobierzFaktury();
      setFaktury(danefaktur);
    };
    
    fetchData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    const danefaktur = await pobierzFaktury();
    setFaktury(danefaktur);
    setRefreshing(false);
      };


  return (
    <View style={styles.container}>
        <View>
          <FlatList
            data={faktury}
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
                <Text style={styles.tytul}>ID Faktury: {item.id}</Text>
                <Text style={styles.tytul}>Kwota: {item.kwota} zł</Text>
                <Text style={styles.tytul}>Zużycie: {item.zuzycie} m³</Text>
                <Text style={styles.tytul}>Data wystawienia: {new Date(item.data_wystawienia).toLocaleDateString()}</Text>
                <Text style={styles.tytul}>Status płatności: {item.status_oplacenia ? "Opłacona" : "Nieopłacona"}</Text>
              </View>
            )}
            ListEmptyComponent={<Text>Brak faktur do wyświetlenia</Text>}
            contentContainerStyle={{ paddingBottom: 200 }}
          />
        </View>
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
