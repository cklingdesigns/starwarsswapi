import React, { useState, useEffect, ChangeEvent } from "react";
import LazyImage from "./LazyImage"; // adjust path if needed

// --- Type Definitions ---
interface Person {
  name: string;
  url: string;
  birth_year?: string;
  height?: string;
  mass?: string;
  hair_color?: string;
  skin_color?: string;
  eye_color?: string;
  gender?: string;
  homeworld: string;
  films: string[];
}

interface Planet {
  name: string;
  url: string;
  climate?: string;
  terrain?: string;
  population?: string;
}

interface Film {
  title: string;
  url: string;
  id?: string;
}

// --- Component ---
const PeopleList: React.FC = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [activePerson, setActivePerson] = useState<Person | null>(null);
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [films, setFilms] = useState<Film[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resPeople = await fetch("https://swapi.info/api/people");
        const dataPeople: Person[] = await resPeople.json();

        const resPlanets = await fetch("https://swapi.info/api/planets");
        const dataPlanets: Planet[] = await resPlanets.json();

        const resFilms = await fetch("https://swapi.info/api/films");
        const dataFilms: Film[] = await resFilms.json();

        setPeople(dataPeople);
        setPlanets(dataPlanets);
        setFilms(dataFilms);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const getFilmTitles = (urls: string[]): string[] => {
    return urls
      ?.map((url) => {
        const match = films.find((film) => film.url === url);
        return match ? match.title : null;
      })
      .filter(Boolean) as string[] || [];
  };

  const handleCardClick = (person: Person): void => {
    setActivePerson(person);
  };

  const handleCloseModal = (): void => {
    setActivePerson(null);
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const getPlanetDetails = (url: string): Planet | null => {
    return planets.find((planet) => planet.url === url) || null;
};
  return (
    <div className="CharacterGrid">
      <div className="SearchBar">
        <input
          type="text"
          className="form-control"
          placeholder="Search Star Wars characters..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {people
        .filter((person) =>
          person.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map((person, index) => {
          const getIdFromUrl = (url: string): string => {
            const parts = url.split("/").filter(Boolean);
            return parts[parts.length - 1];
            
        };
        const imageUrl = `${process.env.PUBLIC_URL}/images/${getIdFromUrl(person.url)}.webp`;

          return (
            <div
              className="CharacterProfiles"
              key={index}
              onClick={() => handleCardClick(person)}
              style={{ cursor: "pointer" }}
            >
              <div className="CharacterImage">
                <LazyImage
                  src={imageUrl || "/images/default-character.jpg"}
                  alt={person.name}
                  className="card-img-top"
                  width="400"
                  onError={(e) => {
                    (e.target as HTMLImageElement).onerror = null;
                    (e.target as HTMLImageElement).src = "/images/default-character.jpg";
                  }}
                />
                <strong>{person.name} (ID: {getIdFromUrl(person.url)})</strong>
              </div>
            </div>
          );
        })}

      {activePerson && (
        <div
          className="modal show fade d-block"
          tabIndex={-1}
          role="dialog"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={handleCloseModal}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            role="document"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title">{activePerson.name}</h2>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body CharacterText">
                <p>Born: {activePerson.birth_year ?? "Unknown"}</p>
                <p>Height: {activePerson.height ?? "Unknown"} m</p>
                <p>Mass: {activePerson.mass ?? "Unknown"} kg</p>
                <p>Hair Color: {activePerson.hair_color ?? "Unknown"}</p>
                <p>Skin Color: {activePerson.skin_color ?? "Unknown"}</p>
                <p>Eye Color: {activePerson.eye_color ?? "Unknown"}</p>
                <p>Gender: {activePerson.gender ?? "Unknown"}</p>
                {(() => {
                    const planet = getPlanetDetails(activePerson.homeworld);
                    return planet ? (
                        <>
                        <p><strong>Home World:</strong> {planet.name}</p>
                        <ul>
                            <li>Climate: {planet.climate ?? "Unknown"}</li>
                            <li>Terrain: {planet.terrain ?? "Unknown"}</li>
                            <li>Population: {planet.population ?? "Unknown"}</li>
                        </ul>
                        </>
                    ) : (
                        <p>Home World: Unknown</p>
                    );
                    })()}

                <p>Films:</p>
                <ul>
                  {getFilmTitles(activePerson.films).map((title, idx) => (
                    <li key={idx}>{title}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PeopleList;
