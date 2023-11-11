import React, { useState} from "react";
import { Outlet } from "react-router-dom";
import "../css/Home.css";
import Navbar from "./Navbar";
import axios from "axios";
import ColorThief from "colorthief";
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function Home() {
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [displayContentColor, setDisplayContentColor] = useState("rgba(255, 255, 255, 0.5)");

  const handlePokemonClick = (pokemon) => {
    setSelectedPokemon(pokemon);
    const color = `rgba(${pokemon.dominantColor.join(", ")})`;
    setDisplayContentColor(color);
  };

  const handleNextPage = async () => {
    await setCurrentPage((prevPage) => prevPage + 1);
    queryClient.invalidateQueries(["pokemon", currentPage + 1]);
  };

  const handlePreviousPage = async () => {
    if (currentPage > 1) {
      await setCurrentPage((prevPage) => prevPage - 1);
      queryClient.invalidateQueries(["pokemon", currentPage - 1]);
    }
  };

  return (
    <>
      <div className="home-container">
        <div className="bg-image"></div>
        <Navbar />
        <div className="homepage-content-box">
          <div className="list-content">
            <div className="pokemon-list">
              <QueryClientProvider client={queryClient}>
                <QueryComponent
                  onPokemonClick={handlePokemonClick}
                  currentPage={currentPage}
                />
              </QueryClientProvider>
              <div className="button-content-box">
                <button
                  className="button-content"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <button className="button-content" onClick={handleNextPage}>
                  Next
                </button>
              </div>
            </div>
          </div>

          <div className="display-content" >
            <div className="INFO" style={{ backgroundColor: displayContentColor }}>
              <div className="image-display">
                {selectedPokemon && (
                  <div className="image-container">
                    <img
                      className="image-pokemon"
                      src={selectedPokemon.officialArtworkUrl}
                      alt={selectedPokemon.name}
                    />
                  </div>
                )}
              </div>
              <div className="info-div">
                {selectedPokemon && (
                  <div className="info-display">
                    <div className="pokemon-name-div">
                      <h3 className="pokemon-name">
                        {selectedPokemon.name.toUpperCase()}
                      </h3>
                    </div>
                    <div className="additional-info">
                      <p>Height: {selectedPokemon.height}</p>
                      <p>Weight: {selectedPokemon.weight}</p>
                      <p>
                        Base Experience: {selectedPokemon.base_experience}
                      </p>
                      <p>
                        Abilities:{" "}
                        {selectedPokemon.abilities
                          .map((ability) => ability.ability.name)
                          .join(", ")}
                      </p>
                      <p>
                        Types:{" "}
                        {selectedPokemon.types
                          .map((type) => type.type.name)
                          .join(", ")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <Outlet />
      </div>
    </>
  );
}

function QueryComponent({ onPokemonClick, currentPage }) {
  const limit = 4;
  const offset = (currentPage - 1) * limit;

  const pokemonInfo = useQuery({
    queryKey: ["pokemon", currentPage],
    queryFn: () => fetchPokemonInfo(offset, limit),
  });

  if (pokemonInfo.isLoading) {
    return <span>Loading...</span>;
  }

  if (pokemonInfo.isError) {
    return <span>Error: {pokemonInfo.data.message}</span>;
  }

  return (
    <div className="pokemon-list">
      {pokemonInfo.data.map((pokemon) => (
        <div
          className="pokemon-info"
          key={pokemon.id}
          onClick={() => onPokemonClick(pokemon)}
          style={{ backgroundColor: `rgb(${pokemon.dominantColor.join(", ")})` }}
        >
          <div className="pokemonId">#{pokemon.id}</div>
          <div className="pokemon-image">
            <img
              className="pokemon-image"
              src={pokemon.sprites.front_default}
              alt={pokemon.name}
              onLoad={(e) => handleImageLoad(e, pokemon)}
            />
          </div>
          <div className="pokemonName">{pokemon.name}</div>
        </div>
      ))}
    </div>
  );

  async function fetchPokemonInfo(offset, limit) {
    const { data } = await axios.get(
      `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
    );

    const detailedPokemonData = await Promise.all(
      data.results.map(async (pokemon) => {
        const response = await axios.get(pokemon.url);
        const officialArtworkUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${response.data.id}.png`;

        // Get the dominant color using colorthief
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = officialArtworkUrl;

        return {
          ...response.data,
          officialArtworkUrl,
          dominantColor: await getDominantColor(img),
        };
      })
    );

    return detailedPokemonData;
  }

  async function getDominantColor(img) {
    return new Promise((resolve) => {
      img.onload = function () {
        const colorThief = new ColorThief();
        const dominantColor = colorThief.getColor(img);
        resolve(dominantColor);
      };
    });
  }

  function handleImageLoad(e, pokemon) {
    const img = e.target;
    getDominantColor(img).then((dominantColor) => {
      onPokemonClick({ ...pokemon, dominantColor });
    });
  }
}
