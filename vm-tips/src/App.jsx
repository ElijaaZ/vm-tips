import "./App.css";
import AppHeader from "./components/AppHeader";
import Navbar from "./components/Navbar";
import { useState } from "react";
import Speltipset from "./components/Speltipset";
import Regler from "./components/Regler";
import Poängtabell from "./components/Poängtabell";

function App() {
  const hasSubmitted = true;
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
          {activeTab === "Mitt Spel" && <Speltipset />}
          {activeTab === "Ställning" && <Poängtabell />}
          {activeTab === "Regler" && <Regler />}
        </main>
      </div>
    </>
  );
}

export default App;
