import React from "react";
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
  },
  {
    name: "Leia Organa",
    birth_year: "19BBY",
    gender: "female",
  },
{
    name: "Wilhuff Tarkin",
    birth_year: "64BBY",
    gender: "male",
  },
{
    name: "Wedge Antilles",
    birth_year: "21BBY",
    gender: "male",
  },
];

// Mock fetch
beforeEach(() => {
  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve({ results: mockPeople }),
    } as Response)
  );
});

afterEach(() => {
  jest.restoreAllMocks();
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

  // Wait for modal content
  await waitFor(() =>
    expect(screen.getByText(/Birth Year/i)).toBeInTheDocument()
  );

  // Check Luke's data in modal
  expect(screen.getByText("Luke Skywalker")).toBeInTheDocument();
  expect(screen.getByText("19BBY")).toBeInTheDocument();
  expect(screen.getByText(/male/i)).toBeInTheDocument();
});
