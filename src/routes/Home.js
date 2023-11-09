import React from "react";
import { Outlet } from "react-router-dom";
import "../css/Home.css";
import Navbar from "./Navbar";
import axios from 'axios';
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
  

const queryClient = new QueryClient();

export default function Home() {
    return (
        <>
        <div className="home-container">
            <div className="bg-image"></div>
            <Navbar /> 
            <div className="homepage-content-box">
            <div className="list-content">
            <QueryClientProvider client={queryClient}>
            <QueryComponent /> 
            </QueryClientProvider>
            </div>
            <div className="display-content">
                </div>
        </div>

            <Outlet />
           
            </div>
        </>
    );
  
}

 
function QueryComponent() {

  const pokemonInfo = useQuery({
    queryKey: ['pokemon'],
    queryFn: fetchPokemonInfo,
  })

  if (pokemonInfo.isLoading) {
    return <span>Loading...</span>
  }

  if (pokemonInfo.isError) {
    return <span>Error: {pokemonInfo.data.message}</span>
  }
  

  return (
    <div className="pokemon-list">
      {pokemonInfo.data.map((pokemon) => (
        <div className="pokemon-info" key={pokemon.id}> {/* Use 'pokemon.id' as the key */}
          <div className="pokemon-id">#{pokemon.id}</div>
          <div className="pokemon-image">
            <img className="pokemon-image" src={pokemon.sprites.front_default} alt={pokemon.name} />
          </div>
          <div className="pokemon-name">{pokemon.name}</div>
        </div>
      ))}
    </div>
  )
  

  async function fetchPokemonInfo() {
    const allPokemonData = [];
    let nextUrl = 'https://pokeapi.co/api/v2/pokemon/';

    while (nextUrl) {
        const { data } = await axios.get(nextUrl);
        const results = data.results;

        const detailedPokemonData = await Promise.all(
            results.map(async (pokemon) => {
                const response = await axios.get(pokemon.url);
                return response.data;
            })
        );

        allPokemonData.push(...detailedPokemonData);

        nextUrl = data.next; 
    }

    return allPokemonData;
}
}
  