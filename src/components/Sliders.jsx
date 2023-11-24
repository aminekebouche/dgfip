import React, { useEffect, useState } from "react";
import Mapi from "./Mapi";
import "./sliders.css";

const Sliders = () => {
  const [villes, setVilles] = useState([]);
  const [departements, setDepartements] = useState([]);

  const [selectedVilles, setSelectedVilles] = useState([]);

  useEffect(() => {
    const fetchDepartements = async () => {
      try {
        const response = await fetch(`https://geo.api.gouv.fr/departements`);

        if (!response.ok) {
          throw new Error("Échec de la requête vers l'API");
        }

        const data = await response.json();
        if (data) {
          setDepartements(data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des contours :", error);
      }
    };

    fetchDepartements();
  }, []);

  const fetchVilles = async (code) => {
    try {
      const response = await fetch(
        `https://geo.api.gouv.fr/departements/${code}/communes`
      );

      if (!response.ok) {
        throw new Error("Échec de la requête vers l'API");
      }

      const data = await response.json();
      if (data) {
        setVilles(data);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des contours :", error);
    }
  };

  return (
    <div className="sliders">
      <div>
        <select
          name="pets"
          id="pet-select"
          onChange={(e) => fetchVilles(e.target.value)}
        >
          <option value="">--Please choose an option--</option>
          {departements.map((item, key) => (
            <option value={item.code} key={key}>
              {item.code} {item.nom}
            </option>
          ))}
        </select>
      </div>
      <div className="container">
        <div className="slider">
          {villes.length !== 0 && (
            <select
              name="pets"
              id="pet-select"
              onChange={(e) =>
                setSelectedVilles([...selectedVilles, e.target.value])
              }
            >
              <option value="">--Please choose an option--</option>
              {villes.map((item, key) => (
                <option value={item.nom} key={key}>
                  {item.code} {item.nom}
                </option>
              ))}
            </select>
          )}
        </div>
        {selectedVilles.length === 2 && <Mapi commune={selectedVilles} />}
        <div className="slider">
          {villes.length !== 0 && (
            <select
              name="pets"
              id="pet-select"
              onChange={(e) =>
                setSelectedVilles([...selectedVilles, e.target.value])
              }
            >
              <option value="">--Please choose an option--</option>
              {villes.map((item, key) => (
                <option value={item.nom} key={key}>
                  {item.code} {item.nom}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sliders;
