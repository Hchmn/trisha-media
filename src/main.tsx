import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AboutYouPage, LandingPage } from "./pages/index.ts";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AlbumPage from "./pages/AlbumPage/AlbumPage.tsx";
import LoginPage from "./pages/LoginPage/LoginPage.tsx";
import SpotifyCallback from "./pages/Spotify/SpotifyCallback.tsx";
import SpotifyPlayer from "./pages/SpotifyPlayer/SpotifyPlayer.tsx";
import { SpotifyProvider } from "./context/SpotifyContext.tsx";

const redirect = sessionStorage.getItem("redirect");

if (redirect) {
  sessionStorage.removeItem("redirect");

  window.history.replaceState(null, "", redirect);
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SpotifyProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about-you" element={<AboutYouPage />} />
          <Route path="/album" element={<AlbumPage />} />
          <Route path="/login-spotify" element={<LoginPage />} />
          <Route path="/callback" element={<SpotifyCallback />} />
          {/* <Route path="/player" element={<SpotifyPlayer />} /> */}
          {/* <SpotifyPlayer /> */}
        </Routes>
      </BrowserRouter>
      <SpotifyPlayer />
    </SpotifyProvider>
  </StrictMode>,
);
