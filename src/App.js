import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import PeopleList from "./components/PeopleList";

function App() {
  return (
    <div className="App">
      <span className="Logo"><img src={process.env.PUBLIC_URL + "/images/sw-logo.png"} alt="Star Wars Characters" /></span>
      <h1>Star Wars Characters</h1>
      <PeopleList />
    </div>
  );
}

export default App;