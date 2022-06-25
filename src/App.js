import './App.css';
import Game from './game/Game';
import logo from "./logo.webp";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        Pokemon Worsle <img src={logo} alt="logo" className="logo"></img>
      </header>
      <main>
        <Game />
      </main>
    </div>
  );
}

export default App;
