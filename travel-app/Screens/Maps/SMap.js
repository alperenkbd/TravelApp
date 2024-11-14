import React, { useState, useEffect } from 'react';
import { FlatList, TextInput, View, Image, Text, ActivityIndicator } from 'react-native';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './../../components/ui/card';

const CountryList = () => {
  const [searchText, setSearchText] = useState('');
  const [filteredCities, setFilteredCities] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const devURL = "https://countriesnow.space";
  const countriesEndpoint = "/api/v0.1/countries";

  useEffect(() => {
    // Fetch and structure data
    const fetchData = async () => {
      try {
        const countriesResponse = await fetch(`${devURL}${countriesEndpoint}`);
        const countriesData = await countriesResponse.json();

        if (!countriesData.error) {
          const citiesWithFlags = countriesData.data.flatMap((country) =>
            country.cities.map((city) => ({
              country: country.country,
              city: city,
              flagUrl: `https://flagsapi.com/${country.iso2}/flat/64.png`,
            }))
          );

          setData(citiesWithFlags);
          setFilteredCities(citiesWithFlags);
        }
      } catch (error) {
        console.error("Data fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Filter based on search text
    if (searchText) {
      const filtered = data.filter(
        (item) =>
          item.country.toLowerCase().includes(searchText.toLowerCase()) ||
          item.city.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredCities(filtered);
    } else {
      setFilteredCities(data);
    }
  }, [searchText, data]);

  const renderCard = ({ item }) => (
    <Card className="my-2 mx-4">
      <CardHeader>
        <Image 
          source={{ uri: item.flagUrl }} 
          style={{ width: 40, height: 30, borderRadius: 5 }} 
          resizeMode="contain" 
        />
      </CardHeader>
      <CardContent>
        <CardTitle>{item.city}</CardTitle>
        <CardDescription>
          Country: {item.country}
        </CardDescription>
      </CardContent>
    </Card>
  );

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <TextInput
        placeholder="Search for a country or city..."
        value={searchText}
        onChangeText={setSearchText}
        style={{
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
          paddingHorizontal: 10,
          marginBottom: 10,
          borderRadius: 5,
        }}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={filteredCities}
          renderItem={renderCard}
          keyExtractor={(item) => `${item.country}-${item.city}`}
        />
      )}
    </View>
  );
};

export default CountryList;
