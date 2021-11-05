import React from 'react';

const Home = () => {
    return (
        <div>
            Home Page
            <button 
                id="flush" 
                onClick={() => { localStorage.clear(); alert('Local Storage cleared.') } }
                style={{ padding: "10px", cursor: "pointer" }}
            >
                Clear Local Storage
            </button>
        </div>
    )
}

export default Home;