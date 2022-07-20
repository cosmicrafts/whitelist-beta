import React from "react";

import logo from "../../resources/design/logo.svg";
import "../css/login.css";

export const Header = (props) => {
    return (
        <>
            <div className='header-main-div'>
                <div className='header-inner-div'>
                    <div className='header-left-div'>
                    <div className='header-left-img-div'>
                        <a href="https://cosmicrafts.com">
                        <img src={logo} className="header-img-logo" alt="" loading="lazy" />
                        </a>
                    </div>
                    </div>
                    <div className='header-middle-div'>
                    
                    <div className="">
                    <div className="">
                        <ul id="menu-main-menu" className="header-links-div">
                        <li id="menu-item-672" className='header-li'>
                            <a className='header-link' href="#">About</a>
                        </li>
                        <li id="menu-item-670" className='header-li'>
                            <a className='header-link' href="https://wp.cosmicrafts.com/">Whitepaper</a>
                        </li>
                        <li id="menu-item-671" className='header-li'>
                            <a className='header-link' href="#">Roadmap</a>
                        </li>
                        <li id="menu-item-673" className='header-li'>
                            <a className='header-link' href="#">Team</a>
                        </li>
                        <li id="menu-item-954" className='header-li'>
                            <a className='header-link' href="#">Community</a>
                        </li>
                        <li id="menu-item-953" className='header-li'>
                            <a className='header-link' href="https://airdrops.cosmicrafts.com">Airdrops</a>
                        </li>
                        <li id="menu-item-955" className='header-li'>
                            <a className='header-link-selected' href="https://play.cosmicrafts.com">Play</a>
                        </li>
                        </ul>
                    </div>
                    </div>

                    </div>
                </div>
            </div>
        </>
    );
};