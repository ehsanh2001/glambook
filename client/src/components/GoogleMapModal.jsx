import React, { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

const GoogleMapModal = ({ show, handleClose, setLocation }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null); // Ref for the map instance
  const markerRef = useRef(null); // Ref for the marker
  const [address, setAddress] = useState("");
  const [latLng, setLatLng] = useState({ lat: null, lng: null });

  useEffect(() => {
    if (show) {
      const initMap = (userLocation) => {
        mapInstance.current = new window.google.maps.Map(mapRef.current, {
          zoom: 10,
          center: userLocation,
          disableDoubleClickZoom: true,
        });

        // Add double-click listener to the map
        mapInstance.current.addListener("dblclick", (event) => {
          const clickedLocation = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
          };

          // Remove any existing markers
          if (markerRef.current) {
            markerRef.current.setMap(null);
          }

          // Create a new marker
          markerRef.current = new window.google.maps.Marker({
            position: clickedLocation,
            map: mapInstance.current,
          });
          setLatLng(clickedLocation);

          // Reverse Geocode to get the address
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location: clickedLocation }, (results, status) => {
            if (status === "OK" && results[0]) {
              setAddress(results[0].formatted_address);
            } else {
              setAddress("Address not found");
            }
          });
        });
      };

      // Fetch user's location based on IP address
      const fetchUserLocation = async () => {
        try {
          const response = await fetch("https://ipapi.co/json/");
          const data = await response.json();
          const userLocation = {
            lat: data.latitude,
            lng: data.longitude,
          };
          initMap(userLocation);
        } catch (error) {
          console.error("Failed to fetch user location:", error);
          const defaultLocation = { lat: 40.7128, lng: -74.006 }; // Default to New York City
          initMap(defaultLocation);
        }
      };

      fetchUserLocation();
    }

    return () => {
      // Clean up the map and marker when modal is closed
      if (mapInstance.current) {
        window.google.maps.event.clearInstanceListeners(mapInstance.current);
      }
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
      setAddress("");
      setLatLng({ lat: null, lng: null });
    };
  }, [show]);

  const handleSave = () => {
    if (latLng.lat && latLng.lng && address) {
      setLocation({ address, lat: latLng.lat, lng: latLng.lng });
    }
    handleClose();
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          // Center map on the current location
          if (mapInstance.current) {
            mapInstance.current.setCenter(currentLocation);
            mapInstance.current.setZoom(15);
          }

          // Remove any existing markers
          if (markerRef.current) {
            markerRef.current.setMap(null);
          }

          // Create a new marker at the current location
          markerRef.current = new window.google.maps.Marker({
            position: currentLocation,
            map: mapInstance.current,
          });
          setLatLng(currentLocation);

          // Reverse Geocode to get the address
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location: currentLocation }, (results, status) => {
            if (status === "OK" && results[0]) {
              setAddress(results[0].formatted_address);
            } else {
              setAddress("Address not found");
            }
          });
        },
        (error) => {
          console.error("Error retrieving current location:", error);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <Dialog open={show} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>Select Location on Map</DialogTitle>
      <DialogContent>
        <div ref={mapRef} style={{ height: "400px", width: "100%" }}></div>
        <Button
          variant="outlined"
          onClick={handleCurrentLocation}
          style={{ marginTop: "16px" }}
        >
          Find My Current Location
        </Button>
        <div style={{ marginTop: "16px" }}>
          <Typography variant="body1">
            <strong>Address:</strong> {address}
          </Typography>
        </div>
      </DialogContent>
      <DialogActions>
        <Button variant="text" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave}>
          Save Location
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GoogleMapModal;
