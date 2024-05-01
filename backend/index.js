import {useState} from 'react';

function SelectPlayer() {
    const [player, setPlayer] = useState(null);
    return (
        <div className="player">
            <label htmlFor="name">
                <input type="text" id="name" onChange={(event) => setPlayer({...player, name: event.target.value})} />
            </label>
        </div>
    )
}