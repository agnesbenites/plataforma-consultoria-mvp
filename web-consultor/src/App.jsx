// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePanel from "./HomePanel";
import ChatPanel from "./ChatPanel";
import AnalyticsPanel from "./AnalyticsPanel"; // Você precisará criar este
import ProfilePanel from "./ProfilePanel"; // Você precisará criar este

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePanel />} />
        <Route path="/dashboard" element={<HomePanel />} />
        <Route path="/chat" element={<ChatPanel />} />
        <Route path="/analytics" element={<AnalyticsPanel />} />
        <Route path="/profile" element={<ProfilePanel />} />
      </Routes>
    </Router>
  );
}

export default App;
