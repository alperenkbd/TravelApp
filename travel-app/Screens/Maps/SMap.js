import React, { useState, useMemo } from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';
import worldMap from './../../global/world.geo.json';

const WorldMap = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [showCountryMap, setShowCountryMap] = useState(false);

  // Memoize the projection calculations
  const projectionConfig = useMemo(() => {
    // Calculate bounds for better map fitting
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;

    worldMap.features.forEach(country => {
      country.geometry.coordinates.forEach(polygon => {
        polygon.forEach(point => {
          minX = Math.min(minX, point[0]);
          maxX = Math.max(maxX, point[0]);
          minY = Math.min(minY, point[1]);
          maxY = Math.max(maxY, point[1]);
        });
      });
    });

    // Add padding
    const padding = 10;
    return {
      minX: minX - padding,
      maxX: maxX + padding,
      minY: minY - padding,
      maxY: maxY + padding,
      width: maxX - minX + (padding * 2),
      height: maxY - minY + (padding * 2)
    };
  }, []);

  // Enhanced path generation with proper scaling
  const coordinatesToSvgPath = (coordinates) => {
    return coordinates.map(polygon => {
      const points = polygon.map(point => {
        const x = ((point[0] - projectionConfig.minX) / projectionConfig.width) * 1000;
        const y = ((point[1] - projectionConfig.minY) / projectionConfig.height) * 1000;
        return `${x},${y}`;
      });
      return `M ${points.join(' L ')} Z`;
    }).join(' ');
  };

  const handleCountryPress = (country) => {
    setSelectedCountry(country);
    setShowCountryMap(true);
    Alert.alert(
      country.properties.name,
      'Would you like to see detailed map?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => setShowCountryMap(false)
        },
        {
          text: 'Yes',
          onPress: () => {
            // Here you would load and display the detailed country map
            // For example, if it's Turkey:
            if (country.properties.name === 'Turkey') {
              // Render Turkey map using TurkeyMap GeoJSON
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {!showCountryMap ? (
        <Svg
          height="100%"
          width="100%"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="xMidYMid meet"
        >
          <G>
            {worldMap.features.map((country, index) => (
              <Path
                key={index}
                d={coordinatesToSvgPath(country.geometry.coordinates)}
                fill={selectedCountry?.properties.name === country.properties.name ? '#4CAF50' : '#E0E0E0'}
                stroke="#FFFFFF"
                strokeWidth={1}
                onPress={() => handleCountryPress(country)}
              />
            ))}
          </G>
        </Svg>
      ) : (
        // Render detailed country map here when selected
        <View style={styles.countryMapContainer}>
          <Text style={styles.countryName}>
            {selectedCountry?.properties.name}
          </Text>
          {/* Add your detailed country map rendering logic here */}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  countryMapContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countryName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default WorldMap;