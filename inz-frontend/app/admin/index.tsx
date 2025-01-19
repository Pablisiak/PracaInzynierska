import { Text, View, FlatList, StyleSheet, RefreshControl } from "react-native";
import pobierzOgloszenia from "../svfunctions/pobierzogloszenia";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function AdminIndex() {
  const [ogloszenia, setOgloszenia] = useState<any[]>([]);
  const [imie, setImie] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const getUserInfo = async () => {
    const imie = await AsyncStorage.getItem('imie');
    setImie(imie);
  }

  useEffect(() => {
    const fetchData = async () => {
      const data = await pobierzOgloszenia(); 
      setOgloszenia(data); 
    };
    
    fetchData();
    getUserInfo();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    const data = await pobierzOgloszenia(); 
    setOgloszenia(data); 
    setRefreshing(false);
      };

  return (
    <View style={styles.container}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <FontAwesome name="smile-o" size={20} color="black" style={{ marginRight: 10 }} />
        <Text style={styles.welcome}>Witaj, {imie}!</Text>
      </View>
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
        </View>
      )}
      ListEmptyComponent={<Text>Brak ogłoszeń do wyświetlenia</Text>}
      contentContainerStyle={{ paddingBottom: 200 }}
    />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  welcome:{
    fontSize: 24,
    fontWeight: 'bold',
  },
  ogloszenieItem: {
    backgroundColor: '#f9f9f9',
    padding: 30,
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
});
