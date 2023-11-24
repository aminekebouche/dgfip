import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const Mapi = (props) => {
  const [contours, setContours] = useState([]);
  const [contours2, setContours2] = useState([]);

  const [center, setCenter] = useState([]);

  const { commune } = props;

  // Coordonnées des contours de la ville de Houilles

  useEffect(() => {
    const fetchContours = async () => {
      try {
        // Effectuer la requête vers l'API
        const response = await fetch(
          `https://geo.api.gouv.fr/communes?nom=${commune[0]}&fields=code,nom,contour,centre`
        );

        if (!response.ok) {
          throw new Error("Échec de la requête vers l'API");
        }

        const data = await response.json();
        const tab = [
          parseFloat(data[0].centre.coordinates[1]),
          parseFloat(data[0].centre.coordinates[0]),
        ];
        // Mettre à jour les contours et le centre
        if (data.length > 0 && data[0].contour) {
          setCenter(tab);
          setContours(inverserCoordonnees(data[0].contour.coordinates[0]));
        }

        const response2 = await fetch(
          `https://geo.api.gouv.fr/communes?nom=${commune[1]}&fields=code,nom,contour,centre`
        );

        if (!response2.ok) {
          throw new Error("Échec de la requête vers l'API");
        }

        const data2 = await response2.json();

        // Mettre à jour les contours et le centre
        if (data2.length > 0 && data2[0].contour) {
          setContours2(inverserCoordonnees(data2[0].contour.coordinates[0]));
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des contours :", error);
      }
    };

    // Appeler la fonction de fetch lorsque la commune change
    fetchContours();
  }, [commune]);

  function inverserCoordonnees(coordonnees) {
    return coordonnees.map(([longitude, latitude]) => [latitude, longitude]);
  }

  return (
    center.length === 2 && (
      <MapContainer
        zoom={10}
        style={{ height: "800px", width: "50%" }}
        center={center}
        id="map"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Polygon positions={contours} />
        <Polygon positions={contours2} color="red" />
      </MapContainer>
    )
  );
};

export default Mapi;
