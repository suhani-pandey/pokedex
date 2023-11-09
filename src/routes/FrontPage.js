import React from "react";
import { Link } from "react-router-dom";
import "../css/FrontPage.css";

export default function FrontPage() {
    return (
        <div className="frontpage-container">
            <div className="background-image"></div>
            <div className="button-container">
                <Link to="/home">
                    <button className="fancy-button">Explore More</button>
                </Link>
            </div>
        </div>
    );
}
