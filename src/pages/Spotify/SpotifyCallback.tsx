import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { exchangeCodeForToken } from "../../spotify/spotifyToken";
import { useSpotify } from "../../context/SpotifyContext";

function SpotifyCallback() {
  const navigate = useNavigate();

  const { setIsLoggedIn } = useSpotify();

  const [message, setMessage] = useState("Connecting to Spotify...");

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search);

      const code = params.get("code");
      const error = params.get("error");

      if (error) {
        console.error("Spotify authorization error:", error);
        setMessage("Spotify authorization failed.");
        return;
      }

      if (!code) {
        return;
      }

      const handledCode = sessionStorage.getItem("spotify_handled_code");

      if (handledCode === code) {
        return;
      }

      sessionStorage.setItem("spotify_handled_code", code);

      try {
        await exchangeCodeForToken(code);

        setIsLoggedIn(true);

        navigate("/", {
          replace: true,
        });
      } catch (error) {
        console.error(error);

        sessionStorage.removeItem("spotify_handled_code");

        setMessage("Unable to connect to Spotify.");
      }
    };

    handleCallback();
  }, [navigate, setIsLoggedIn]);

  return <h2>{message}</h2>;
}

export default SpotifyCallback;
