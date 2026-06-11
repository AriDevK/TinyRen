import { useState } from 'react';
import './Debug.css';
import Highlight from 'react-highlight'
import json from 'highlight.js/styles/atom-one-dark.css'


export default function Debug({ scene, dialogue, vars }) {
    const [showDebug, setShowDebug] = useState(false);
    const [activeTab, setActiveTab] = useState("variables");

    const isActiveTab = (tabName) => activeTab === tabName ? "active" : "";

    return (
        scene && (

            showDebug ? (
                <div className="debug">
                    <h2>Debug Info</h2>
                    <div className="tabGroup">
                        <button className={`tabButton ${isActiveTab("variables")}`} onClick={() => setActiveTab("variables")}>Variables</button>
                        <button className={`tabButton ${isActiveTab("scene")}`} onClick={() => setActiveTab("scene")}>Scene</button>
                        <button className={`tabButton ${isActiveTab("dialogue")}`} onClick={() => setActiveTab("dialogue")}>Dialogue</button>
                        <button className="tabButton" onClick={() => setShowDebug(false)}>Close Debug</button>
                    </div>
                    <div className="tabContent" style={{ display: activeTab === "variables" ? "block" : "none" }}>
                        <Highlight className='language-json'>
                            {JSON.stringify(vars, null, 2)}
                        </Highlight>
                    </div>  
                    <div className="tabContent" style={{ display: activeTab === "scene" ? "block" : "none" }}>
                        <Highlight className='language-json'>
                            {JSON.stringify(scene, null, 2)}
                        </Highlight>
                    </div>
                    <div className="tabContent" style={{ display: activeTab === "dialogue" ? "block" : "none" }}>
                        <Highlight className='language-json'>
                            {JSON.stringify(dialogue, null, 2)}
                        </Highlight>
                    </div>

                </div>
            ) : (
                <button onClick={() => setShowDebug(true)} style={{ position: "absolute", top: 10, right: 10, zIndex: 1000 }}>
                    Show Debug
                </button>
            )
        )
    )
}