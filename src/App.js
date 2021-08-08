import "./App.css";
import Timer from "./components/Timer";
import { useLocalStorage } from "react-use";
import GithubCorner from "react-github-corner";

function App() {
  const [timers, setTimers] = useLocalStorage("timers", [new Date().valueOf()]);

  const addAnotherTimer = () => {
    setTimers([...timers, new Date().valueOf()]);
  };

  const deleteTimer = (id) => {
    const index = timers.findIndex((item) => item === id);
    const newTimers = [
      ...timers.slice(0, index),
      ...timers.slice(index + 1, timers.length),
    ];
    setTimers(newTimers);
  };

  return (
    <div className="App">
      {timers.map((id, index) => {
        return (
          <Timer
            key={id}
            id={id}
            name={index}
            deleteTimer={deleteTimer}
          ></Timer>
        );
      })}
      <button className="addAnotherButton" onClick={addAnotherTimer}>
        + Add another timer
      </button>
      <GithubCorner href="https://github.com/megaxayda/persist-timer" />
    </div>
  );
}

export default App;
