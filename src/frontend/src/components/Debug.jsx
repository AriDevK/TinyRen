import { useState } from 'react';
import './Debug.css';
import "@andypf/json-viewer"


export default function Debug({ scene, dialogue, vars }) {
    const [showDebug, setShowDebug] = useState(false);
    const [activeTab, setActiveTab] = useState("variables");

    const isActiveTab = (tabName) => activeTab === tabName ? "active" : "";

    const tabContent = (content) => {
        return (
            <andypf-json-viewer
                indent="4"
                expanded="true"
                theme="onedark"
                show-data-types="false"
                show-toolbar="false"
                expand-icon-type="circle"
                show-copy="true"
                show-size="false"
                expand-empty="false"
                data={JSON.stringify(content, null, 2)}
            ></andypf-json-viewer>
        )
    }

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
                        {tabContent(vars)}
                    </div>
                    <div className="tabContent" style={{ display: activeTab === "scene" ? "block" : "none" }}>
                        {tabContent(scene)}
                    </div>
                    <div className="tabContent" style={{ display: activeTab === "dialogue" ? "block" : "none" }}>
                        {tabContent(dialogue)}
                    </div>

                </div>
            ) : (
                <button onClick={() => setShowDebug(true)} style={{ position: "absolute", top: 10, right: 50, zIndex: 1000 }}>
                    Show Debug
                </button>
            )
        )
    )
}