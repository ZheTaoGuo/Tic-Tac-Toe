import './App.css';
import {useState} from 'react';
import PlayerSignup from "./components/PlayerSignup";
import PlayerLogin from "./components/PlayerLogin";
import { StreamChat } from 'stream-chat';
import Cookies from 'universal-cookie';


function App() {
  const apiKey = "8tuxahjsz9va";
  console.log(apiKey)
  const client = StreamChat.getInstance(apiKey);
  const cookies = new Cookies();
  const token = cookies.get("token");
  const [isAuth, setIsAuth] = useState(false);
  
  const logOut = () => {
    cookies.remove("token");
    cookies.remove("userId");
    cookies.remove("username");
    cookies.remove("firstName");
    cookies.remove("lastName");
    cookies.remove("hashedPassword");
    client.disconnectUser();
    setIsAuth(false);
  }
  if (token) {
    client.connectUser({
      id: cookies.get("userId"),
      name: cookies.get("username"),
      firstName: cookies.get("firstName"),
      lastName: cookies.get("lastName"),
      hashedPassword: cookies.get("hashedPassword")
    }, token).then((user) => {
      setIsAuth(true);
    })
  }
  return (
    <div className="App">
      {isAuth ? (<button onClick={logOut}>Log Out</button>) : (
      <>
        <PlayerSignup setIsAuth={setIsAuth} />
        <PlayerLogin setIsAuth={setIsAuth} />
      </>     
      )}
    </div>
  );
}

export default App;
