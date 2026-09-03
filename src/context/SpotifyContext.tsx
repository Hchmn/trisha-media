import { createContext, useContext, useState, type ReactNode } from "react";

interface SpotifyContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
}

const SpotifyContext = createContext<SpotifyContextType | undefined>(undefined);

interface SpotifyProviderProps {
  children: ReactNode;
}

export function SpotifyProvider({ children }: SpotifyProviderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return !!localStorage.getItem("spotify_access_token");
  });

  console.log("ISLOGGED IN", isLoggedIn);

  return (
    <SpotifyContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
}

export function useSpotify() {
  const context = useContext(SpotifyContext);

  if (!context) {
    throw new Error("useSpotify must be used inside SpotifyProvider");
  }

  return context;
}
