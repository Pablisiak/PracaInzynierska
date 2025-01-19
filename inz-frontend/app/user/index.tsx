import { Text, View, FlatList, StyleSheet, Dimensions, RefreshControl } from "react-native";
import pobierzOgloszenia from "../svfunctions/pobierzogloszenia";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import pobierzFaktury, { Dane } from "../svfunctions/pobierzfaktury";
import { LineChart } from "react-native-chart-kit";

export default function UserIndex() {
  const [ogloszenia, setOgloszenia] = useState<any[]>([]);
  const [imie, setImie] = useState<string | null>(null);
  const [faktury, setFaktury] = useState<Dane[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<Dane | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const getUserInfo = async () => {
    const imie = await AsyncStorage.getItem('imie');
    setImie(imie);
  }

  useEffect(() => {
    const fetchData = async () => {
      const data = await pobierzOgloszenia(); 
      setOgloszenia(data); 
      const danefaktur = await pobierzFaktury();
      setFaktury(danefaktur);
      setLoading(false);
    };
    
    fetchData();
    getUserInfo();
  }, []);

  const daneWykresu = () => {
    if (faktury.length === 0) return { labels: [], datasets: [] };
    const reversedFaktury = [...faktury].reverse();
    const labels = reversedFaktury.map(f => `${f.kwota.toFixed(2)}`);
    const data = reversedFaktury.map(f => f.zuzycie);
    return {
      labels,
      datasets: [{
        data,
        strokeWidth: 2,
      }]
    };
  };

  const handleDataPointClick = (data: any) => {
    const index = data.index;
    const reversedFaktury = [...faktury].reverse();
    const clickedInvoice = reversedFaktury[index];
    setSelectedInvoice(clickedInvoice);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    const data = await pobierzOgloszenia(); 
    setOgloszenia(data); 
    const danefaktur = await pobierzFaktury();
    setFaktury(danefaktur);
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <FontAwesome name="smile-o" size={20} color="black" style={{ marginRight: 10 }} />
        <Text style={styles.welcome}>Witaj, {imie}!</Text>
      </View>

      {loading ? (
        <Text>Ładowanie..</Text>
      ) : (
        <>
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
          />

          {faktury.length > 0 && (
            <LineChart
              data={daneWykresu()}
              width={Dimensions.get('window').width - 40}
              height={220}
              chartConfig={{
                backgroundColor: "#f9f9f9",
                backgroundGradientFrom: "#f9f9f9",
                backgroundGradientTo: "#f9f9f9",
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 8
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "#000000"
                }
              }}
              withInnerLines={false}
              withOuterLines={true}
              onDataPointClick={handleDataPointClick}
            />
          )}

          {selectedInvoice && (
            <View style={styles.invoiceDetails}>
              <Text style={styles.invoiceTitle}>Szczegóły faktury:</Text>
              <Text>ID Faktury: {selectedInvoice.id}</Text>
              <Text>Kwota: {selectedInvoice.kwota} zł</Text>
              <Text>Zużycie: {selectedInvoice.zuzycie} m³</Text>
              <Text>Data wystawienia: {new Date(selectedInvoice.data_wystawienia).toLocaleDateString()}</Text>
              <Text>Status opłacenia: {selectedInvoice.status_oplacenia ? 'Opłacona' : 'Nieopłacona'}</Text>
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  welcome: {
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
  invoiceDetails: {
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
  invoiceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
