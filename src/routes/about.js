import React from "react";
import { Outlet} from "react-router-dom";
import "../css/about.css"; 
import Navbar from "./Navbar";
import pokeImage from "../images/butterfree-f.gif"; 
import dragon from "../images/charizard.gif"; 

export default function About() { 
    
    return (
        <>
        <div className="about-container">
            <div className="bg-about"></div>
            <Navbar /> 
            <div className="about-content-box">
                <div className="about-content">
                <ul>
                        <li>Pokémon information is retrieved from PokéAPI.</li>
                        <li>The Pokédex displays a list of Pokémon and supports simple pagination (e.g., “next” and “previous” buttons to get the next/previous page of Pokémon), such that not all Pokémon are displayed at the same time.</li>
                        <li>When a user clicks on a specific Pokémon, additional information about that Pokémon is displayed. E.g. type(s), stats, abilities, height, and weight.</li>
                        <li>The application contains multiple pages and utilizes React Router to route between them.</li>
                        <li>The application is developed using the Create React App toolchain.</li>
                    </ul>
                </div>
            </div>
            <div class= "butterfly"><img src={pokeImage}  alt="pokeball" /></div>
            <div class= "dragon"><img src={dragon} alt="pokeball" /></div>
            <Outlet />
        </div>
        </>
    );
}
