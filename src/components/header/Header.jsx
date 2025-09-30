import React from 'react'
import './header.css';
import { Link } from "react-scroll";

const Header = () => {
    return (
        <>
            <div className="cont">
                <span>Stellar View</span>
                <div className="list">

                    <ul>
                        <li><Link to="apod" smooth={true} duration={600}>APOD</Link></li>
                        <li><Link to="mars" smooth={true} duration={600}>Mars Rover</Link></li>
                        <li><Link to="earth" smooth={true} duration={600}>Earth Images</Link></li>
                    </ul>
                </div>

            </div>
        </>
    )
}

export default Header
