// SearchComponent.js
import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import { MapLibreSearchControl } from '@stadiamaps/maplibre-search-box';
import '@stadiamaps/maplibre-search-box/dist/style.css';

const SearchComponent = ({ onResultSelected }) => {
  const controlRef = useRef(null);

  useEffect(() => {
    if (controlRef.current) {
      const control = new MapLibreSearchControl({
        onResultSelected: feature => {
          console.log(feature.geometry.coordinates);
          if (onResultSelected) {
            onResultSelected(feature.geometry.coordinates);
          }
        },
      });

      controlRef.current.appendChild(control.onAdd());
    }

    // Cleanup
    return () => {
      if (controlRef.current) {
        controlRef.current.innerHTML = '';
      }
    };
  }, [onResultSelected]);

  return <View ref={controlRef} style={{ height: 50, width: '100%' }} />;
};

export default SearchComponent;
