import './Saving.css';

export default function Saving({ show }) {
    return (<span className="saving-overlay" style={{ display: show ? "flex" : "none" }}>
        <br></br>
        <h4 className="saving-text">Saving...</h4>
    </span>
    );
}