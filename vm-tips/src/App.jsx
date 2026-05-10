import "./App.css";
import AppHeader from "./components/AppHeader";
import Navbar from "./components/Navbar";
import { useState } from "react";
import Speltipset from "./components/Speltipset";
import Regler from "./components/Regler";

function App() {
  const hasSubmitted = false;
  const [activeTab, setActiveTab] = useState("Mitt Spel");
  return (
    <>
      <div>
        <AppHeader />
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          hasSubmitted={hasSubmitted}
        />
        <main>
          {activeTab === "Speltipset" && <Speltipset />}
          {activeTab === "Mitt Spel" && <h1>Mitt Spel</h1>}
          {activeTab === "Ställning" && <h1>Ställning</h1>}
          {activeTab === "Regler" && <Regler />}
        </main>
      </div>
    </>
  );
}

export default App;
