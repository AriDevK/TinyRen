import './App.css';
import './Menu.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { GetMenu, GetMenuBackground, Close } from "../wailsjs/go/main/App";

export default function Menu() {
    const [menu, setMenu] = useState(null);
    const [menuOptions, setMenuOptions] = useState('');
    const [background, setBackground] = useState("black");
    const navigate = useNavigate();

    useEffect(() => {
        try {
            document.body.style.animation = 'none';
            document.body.offsetWidth;
            document.body.style.animation = 'fadeIn 1s ease-in-out';
            // wait a second
        } catch (e) {
        }

        GetMenu().then(fetchedMenu => {
            setMenu(fetchedMenu);
            GetMenuBackground().then(bg => {
                setBackground(bg);
            }).catch(err => {
                console.error("Error fetching menu background:", err);
            })
        });
    }, []);

    return (
        menu && background && (
            <div id="app"
                    style={{
                        background: background,
                        width: "100vw",
                        height: "100vh",
                        backgroundSize: "cover",
                    }}
                >
                <br></br>
                {/* <h1 className="menu-title">Main Menu</h1> */}
                <div className="menu-button-container">
                    <button className="menu-button" onClick={() => navigate('/begin')}>Start Game</button>
                    <button disabled={true} className="menu-button" onClick={() => navigate('/load')}>Load Game</button>
                    <button className="menu-button" onClick={() => Close().then(() => console.log("Application closed"))}>Exit</button>
                </div>
            </div>
        )
    );
}