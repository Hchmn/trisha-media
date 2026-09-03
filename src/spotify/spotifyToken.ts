const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;

const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;

export async function exchangeCodeForToken(code: string) {
  const verifier = localStorage.getItem("spotify_code_verifier");

  if (!verifier) {
    throw new Error("Spotify code verifier not found");
  }

  const body = new URLSearchParams();

  body.append("client_id", clientId);

  body.append("grant_type", "authorization_code");

  body.append("code", code);

  body.append("redirect_uri", redirectUri);

  body.append("code_verifier", verifier);

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",

    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },

    body,
  });

  if (!response.ok) {
    const error = await response.text();

    throw new Error(error);
  }

  const data = await response.json();

  localStorage.setItem("spotify_access_token", data.access_token);

  if (data.refresh_token) {
    localStorage.setItem("spotify_refresh_token", data.refresh_token);
  }

  const expiresAt = Date.now() + data.expires_in * 1000;

  localStorage.setItem("spotify_token_expires_at", expiresAt.toString());

  localStorage.removeItem("spotify_code_verifier");

  return data;
}
