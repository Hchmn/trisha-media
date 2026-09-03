import { useEffect, useRef, useState, memo } from "react";
import styles from "./SpotifyPlayer.module.css";
import { loginWithSpotify } from "../../auth/spotifyAuth";
import { useSpotify } from "../../context/SpotifyContext";

interface SpotifyTrack {
  id: string;
  name: string;
  uri: string;
  artists: {
    name: string;
  }[];
  album: {
    images: {
      url: string;
    }[];
  };
}

function SpotifyPlayer() {
  const playerRef = useRef<any>(null);

  const [deviceId, setDeviceId] = useState("");

  const [search, setSearch] = useState("Statue lil Eddie");
  const [results, setResults] = useState<SpotifyTrack[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<SpotifyTrack | null>(null);

  const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null);

  const [paused, setPaused] = useState(true);
  const [, setPosition] = useState(0);
  const [, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.1);

  const [minimized, setMinimized] = useState(false);

  const { isLoggedIn } = useSpotify();

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    const token = localStorage.getItem("spotify_access_token");

    if (!token) {
      return;
    }

    const initializePlayer = () => {
      if (!window.Spotify) {
        return;
      }

      if (playerRef.current) {
        return;
      }

      const player = new window.Spotify.Player({
        name: "My Spotify Web Player",

        getOAuthToken: (callback: (token: string) => void) => {
          const accessToken = localStorage.getItem("spotify_access_token");

          if (accessToken) {
            callback(accessToken);
          }
        },

        volume: volume,
      });

      player.addListener(
        "initialization_error",
        ({ message }: { message: string }) => {
          console.error("Initialization error:", message);
        },
      );

      player.addListener(
        "authentication_error",
        ({ message }: { message: string }) => {
          console.error("Authentication error:", message);
        },
      );

      player.addListener(
        "account_error",
        ({ message }: { message: string }) => {
          console.error("Account error:", message);
        },
      );

      player.addListener(
        "playback_error",
        ({ message }: { message: string }) => {
          console.error("Playback error:", message);
        },
      );

      player.addListener("ready", ({ device_id }: { device_id: string }) => {
        console.log("Spotify player ready:", device_id);

        setDeviceId(device_id);
      });

      player.addListener(
        "not_ready",
        ({ device_id }: { device_id: string }) => {
          console.log("Spotify player not ready:", device_id);

          setDeviceId("");
        },
      );

      player.addListener("player_state_changed", (state: any) => {
        if (!state) {
          return;
        }

        setCurrentTrack(state.track_window.current_track);

        setPaused(state.paused);
        setPosition(state.position);
        setDuration(state.duration);
      });

      player.addListener(
        "playback_error",
        ({ message }: { message: string }) => {
          console.error("Playback error:", message);
        },
      );

      player.connect().then((success: boolean) => {
        console.log("Spotify player connected:", success);
      });

      playerRef.current = player;
    };

    if (window.Spotify) {
      initializePlayer();
    } else {
      window.onSpotifyWebPlaybackSDKReady = () => {
        console.log("Spotify SDK loaded");
        initializePlayer();
      };

      if (!document.getElementById("spotify-player-sdk")) {
        const script = document.createElement("script");

        script.id = "spotify-player-sdk";
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        console.log("Loading Spotify SDK...");
      }
    }
    return () => {
      if (playerRef.current) {
        playerRef.current.disconnect();
        playerRef.current = null;
      }

      setDeviceId("");
    };
  }, [isLoggedIn]);

  // =========================
  // SEARCH
  // =========================

  const searchSpotify = async () => {
    if (!search.trim()) {
      setResults([]);
      return;
    }

    const token = localStorage.getItem("spotify_access_token");

    if (!token) return;

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          search,
        )}&type=track&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }

      const data = await response.json();

      setResults(data.tracks.items);
    } catch (error) {
      console.error(error);
    }
  };

  // =========================
  // PLAY SELECTED SONG
  // =========================

  const playSelectedTrack = async () => {
    if (!selectedTrack || !deviceId) return;

    const token = localStorage.getItem("spotify_access_token");

    if (!token) return;

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
        {
          method: "PUT",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            uris: [selectedTrack.uri],
          }),
        },
      );

      if (!response.ok) {
        const error = await response.text();

        throw new Error(`Playback failed: ${response.status} ${error}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePlayPause = async () => {
    if (!selectedTrack) {
      return;
    }

    // Different selected song
    if (!currentTrack || currentTrack.uri !== selectedTrack.uri) {
      await playSelectedTrack();
      return;
    }

    // Same song
    if (playerRef.current) {
      await playerRef.current.togglePlay();
    }
  };

  const handlePrevious = async () => {
    if (!selectedTrack || !playerRef.current) return;

    await playerRef.current.previousTrack();
  };

  const handleNext = async () => {
    if (!selectedTrack || !playerRef.current) return;

    await playerRef.current.nextTrack();
  };

  const handleVolume = async (value: number) => {
    if (!playerRef.current) return;

    await playerRef.current.setVolume(value);

    setVolume(value);
  };

  // const handleSeek = async (value: number) => {
  //   if (!selectedTrack || !playerRef.current) return;

  //   await playerRef.current.seek(value);

  //   setPosition(value);
  // };

  // const formatTime = (milliseconds: number) => {
  //   const seconds = Math.floor(milliseconds / 1000);

  //   const minutes = Math.floor(seconds / 60);

  //   return `${minutes}:${(seconds % 60).toString().padStart(2, "0")}`;
  // };

  useEffect(() => {
    console.log("SpotifyPlayer MOUNTED");

    return () => {
      console.log("SpotifyPlayer UNMOUNTED");
    };
  }, []);

  console.log("selectedTrack:", selectedTrack);
  console.log("deviceId:", deviceId);
  console.log("disabled:", !selectedTrack || !deviceId);

  return (
    <>
      {!minimized && (
        <>
          {isLoggedIn ? (
            <div className={styles.player}>
              {/* SEARCH */}
              <button
                className={styles.hideButton}
                onClick={() => setMinimized(true)}
              >
                ✕
              </button>

              <div className={styles.search}>
                <input
                  type="text"
                  placeholder="Search Spotify..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      searchSpotify();
                    }
                  }}
                />

                <button onClick={searchSpotify}>Search</button>
              </div>

              {/* SEARCH RESULTS */}

              {results.length > 0 && (
                <div className={styles.results}>
                  {results.map((track) => (
                    <button
                      key={track.id}
                      className={`${styles.resultItem} ${
                        selectedTrack?.id === track.id ? styles.selected : ""
                      }`}
                      onClick={() => setSelectedTrack(track)}
                    >
                      <img src={track.album.images[2]?.url} alt={track.name} />

                      <div>
                        <strong>{track.name}</strong>

                        <span>
                          {track.artists
                            .map((artist) => artist.name)
                            .join(", ")}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* SELECTED TRACK */}

              {selectedTrack ? (
                <div className={styles.track}>
                  <img
                    className={styles.albumCover}
                    src={selectedTrack.album.images[0]?.url}
                    alt={selectedTrack.name}
                  />

                  <h2>{selectedTrack.name}</h2>

                  <p>
                    {selectedTrack.artists
                      .map((artist) => artist.name)
                      .join(", ")}
                  </p>
                </div>
              ) : (
                <div className={styles.empty}>Search and select a song</div>
              )}

              {/* CONTROLS */}

              <div className={styles.controlsRow}>
                <div className={styles.controls}>
                  <button disabled={!selectedTrack} onClick={handlePrevious}>
                    ⏮
                  </button>

                  <button
                    className={styles.playButton}
                    disabled={!selectedTrack || !deviceId}
                    onClick={handlePlayPause}
                  >
                    {paused ? "▶" : "❚❚"}
                  </button>

                  <button disabled={!selectedTrack} onClick={handleNext}>
                    ⏭
                  </button>
                </div>

                <div className={styles.volume}>
                  <span className={styles.volumeIcon}>
                    {volume === 0 ? "🔇" : volume < 0.5 ? "🔉" : "🔊"}
                  </span>

                  <input
                    className={styles.volumeSlider}
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(event) =>
                      handleVolume(Number(event.target.value))
                    }
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.player}>
              <button
                className={styles.hideButton}
                onClick={() => setMinimized(true)}
              >
                ✕
              </button>

              <div className={styles.loginContainer}>
                <div className={styles.spotifyLogo}>♪</div>

                <h3>Spotify Player</h3>

                <p>Connect your Spotify account to search and play music.</p>

                <button
                  className={styles.loginButton}
                  onClick={loginWithSpotify}
                >
                  Connect Spotify
                </button>
              </div>
            </div>
          )}
        </>
      )}
      {minimized && (
        <button
          className={styles.floatingButton}
          onClick={() => setMinimized(false)}
          aria-label="Open Spotify player"
        >
          ♪
        </button>
      )}
    </>
  );
}

export default memo(SpotifyPlayer);
