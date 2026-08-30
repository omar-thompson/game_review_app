import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api")
      .then((response) => response.text())
      .then((data) => {
        setMessage(data);
      })
      .catch((error) => {
        console.error("Error connecting to backend:", error);
        setMessage("Could not connect to backend");
      });
  }, []);

  return (
    <div>
      <h1>Game Review App</h1>

      <p>{message}</p>
    </div>
  );
}

export default App;
