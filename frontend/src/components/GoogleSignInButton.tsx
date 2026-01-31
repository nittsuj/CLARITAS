import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

export function GoogleSignInButton() {
  return (
    <GoogleLogin
      onSuccess={async (credentialResponse) => {
        const idToken = credentialResponse.credential;
        if (!idToken) return;

        // Optional: send to backend to verify token (recommended).
        // If backend isn't ready yet, you can comment this out.
        try {
          await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/google`, {
            id_token: idToken,
          });
        } catch (e) {
          // ignore in hackathon mode
          console.warn("Backend auth not available yet:", e);
        }

        window.location.href = "/dashboard";
      }}
      onError={() => {
        alert("Google Sign-In gagal. Coba lagi ya.");
      }}
      useOneTap
    />
  );
}
