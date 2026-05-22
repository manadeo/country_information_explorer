import React, { useContext, useEffect } from "react";
import axios from "axios";
import { AppContext, AppProvider } from "./context/AppContext";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import BookmarkPage from "./pages/BookmarkPage";
import DetailModal from "./components/DetailModal";
import ShareModal from "./components/ShareModal";

function MainApp() {
  const { setActiveCountry, currentPage } = useContext(AppContext);

  // Monitor deep-linking (?code=CAN) on load to auto-open details
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const countryCode = params.get("code");

    if (countryCode) {
      axios
        .get(`http://localhost:5000/api/countries/code/${countryCode}`)
        .then((res) => {
          if (res.data.success) {
            setActiveCountry(res.data.data);
            window.history.replaceState(
              {},
              document.title,
              window.location.pathname,
            );
          }
        })
        .catch((err) => console.error("Deep-linking fetch error:", err));
    }
  }, [setActiveCountry]);

  return (
    <div className="app-container">
      {/* Navigation Header */}
      <Navbar />

      {/* Main Pages Switch */}
      <main>
        {currentPage === "bookmarks" ? <BookmarkPage /> : <HomePage />}
      </main>

      {/* Overlay Drawer Details Modal */}
      <DetailModal />

      {/* Social Media Sharing Modal */}
      <ShareModal />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
