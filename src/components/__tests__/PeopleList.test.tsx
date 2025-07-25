import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PeopleList from "../PeopleList";
import { AuthProvider } from "../Auth";
import '@testing-library/jest-dom';

// Mock data
const mockPeople = [
  {
    name: "Luke Skywalker",
    birth_year: "19BBY",
    gender: "male",
    height: "172",
    mass: "77",
    hair_color: "blond",
    skin_color: "fair",
    eye_color: "blue",
    homeworld: "https://swapi.info/api/planets/1",
    films: [
        "https://swapi.info/api/films/1",
        "https://swapi.info/api/films/2",
        "https://swapi.info/api/films/3",
        "https://swapi.info/api/films/6"
    ],
    url: "https://swapi.info/api/people/1",
  },
];

// Mock fetch
beforeEach(() => {
  jest.spyOn(global, "fetch").mockImplementation((url) => {
    if (typeof url === "string") {
      if (url.includes("/people")) {
        return Promise.resolve({
          json: () => Promise.resolve(mockPeople),
        } as Response);
      }
      if (url.includes("/planets")) {
        return Promise.resolve({
          json: () => Promise.resolve([
              {
                name: "Tatooine",
                url: "https://swapi.info/api/planets/1",
                climate: "arid",
                terrain: "desert",
                population: "200000",
            },
            ]),
        } as Response);
      }
      // Match exact film URLs
      const filmMatch = {
        "https://swapi.info/api/films/1": { title: "A New Hope", url: "https://swapi.info/api/films/1" },
        "https://swapi.info/api/films/2": { title: "The Empire Strikes Back", url: "https://swapi.info/api/films/2" },
        "https://swapi.info/api/films/3": { title: "Return of the Jedi", url: "https://swapi.info/api/films/3" },
        "https://swapi.info/api/films/6": { title: "Revenge of the Sith", url: "https://swapi.info/api/films/6" },
      } as Record<string, { title: string; url: string }>;
      
      if (url in filmMatch) {
        return Promise.resolve({
          json: () => Promise.resolve(filmMatch[url]),
        } as Response);
      }

      // Optional: if your component calls `/films` to preload all
      if (url.includes("/films")) {
        return Promise.resolve({
          json: () => Promise.resolve(Object.values(filmMatch)),
        } as Response);
      }
    }

    return Promise.reject(new Error("Unknown URL"));
  });
});

test("modal opens with correct person's information", async () => {
  render(
    <AuthProvider>
      <PeopleList />
    </AuthProvider>
  );

  // Wait for Luke Skywalker to appear
  const lukeCard = await screen.findByText(/Luke Skywalker/i);
  fireEvent.click(lukeCard);

  await waitFor(() => expect(screen.getByText("LUKE SKYWALKER")).toBeInTheDocument());
    // Check Luke's data in modal
    expect(screen.getByText((content, node) => {
    return node?.textContent === "19BBY";
    })).toBeInTheDocument();
    expect(screen.getByText(/MALE/)).toBeInTheDocument();
    expect(screen.getByText(/172 cm/)).toBeInTheDocument();
    expect(screen.getByText(/77 kg/)).toBeInTheDocument();
    expect(screen.getByText(/blond/)).toBeInTheDocument();
    expect(screen.getByText(/fair/)).toBeInTheDocument();
    expect(screen.getByText(/blue/)).toBeInTheDocument();
    expect(screen.getByText(/Tatooine/)).toBeInTheDocument();
    expect(screen.getByText(/arid/)).toBeInTheDocument();
    expect(screen.getByText(/desert/)).toBeInTheDocument();
    expect(screen.getByText(/200000/)).toBeInTheDocument();
    expect(screen.getByText(/A New Hope/)).toBeInTheDocument();
    expect(screen.getByText(/The Empire Strikes Back/i)).toBeInTheDocument();
    expect(screen.getByText(/Return of the Jedi/i)).toBeInTheDocument();
    expect(screen.getByText(/Revenge of the Sith/i)).toBeInTheDocument();
});
