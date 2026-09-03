import { loginWithSpotify } from "../../auth/spotifyAuth";

const LoginPage = () => {
  return (
    <div style={{ cursor: "initial" }}>
      <h1>My Music App</h1>

      <button onClick={loginWithSpotify}>Login with Spotify</button>
    </div>
  );
};

export default LoginPage;
