import { useState } from 'react';
import Axios from "axios";
import Cookies from "universal-cookie";

function PlayerSignUp(){
    const cookies = new Cookies();
    const [player, setPlayer] = useState(null);

    const signup = () => {
        Axios.post("http://localhost:3001/signup", player)
        .then((response) => {
            const {userId, token, firstName, lastName, username, hashedPassword} = response.data;
            cookies.set("token", token);
            cookies.set("userId", userId);
            cookies.set("username", username);
            cookies.set("firstName", firstName);
            cookies.set("lastName", lastName);
            cookies.set("hashedPassword", hashedPassword);
        })
    }
    return (
        <div>
        <div className="player">
            <label htmlFor="firstName">
                <input type="text" placeholder="firstName" id="firstName" onChange={(event) => setPlayer({...player, firstName: event.target.value})} />
            </label>

            <label htmlFor="lastName">
                <input type="text" placeholder="lastName" id="lastName" onChange={(event) => setPlayer({...player, lastName: event.target.value})} />
            </label>

            <label htmlFor="username">
                <input type="text" placeholder="username" id="username" onChange={(event) => setPlayer({...player, username: event.target.value})} />
            </label>

            <label htmlFor="password">
                <input type="password" placeholder="password" id="password" onChange={(event) => setPlayer({...player, password: event.target.value})} />
            </label>
        </div>
        <button onClick={signup}>Sign Up</button>
        </div>
    )
}

export default PlayerSignUp;