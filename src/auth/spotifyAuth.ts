const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;

const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;

function generateCodeVerifier(length = 128): string {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let text = "";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  const data = new TextEncoder().encode(codeVerifier);

  const digest = await window.crypto.subtle.digest("SHA-256", data);

  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function loginWithSpotify() {
  const verifier = generateCodeVerifier();

  const challenge = await generateCodeChallenge(verifier);

  localStorage.setItem("spotify_code_verifier", verifier);

  const params = new URLSearchParams();

  params.append("client_id", clientId);
  params.append("response_type", "code");
  params.append("redirect_uri", redirectUri);

  params.append(
    "scope",
    [
      "user-read-private",
      "user-read-email",
      "streaming",
      "user-read-playback-state",
      "user-modify-playback-state",
    ].join(" "),
  );

  params.append("code_challenge_method", "S256");

  params.append("code_challenge", challenge);

  window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
}
