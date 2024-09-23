import decode from "jwt-decode";

class AuthService {
  getProfile() {
    return decode(this.getToken());
  }

  getUser() {
    return JSON.parse(sessionStorage.getItem("user"));
  }

  loggedIn() {
    const token = this.getToken();
    // If there is a token and it's not expired, return `true`
    return token && !this.#isTokenExpired(token) ? true : false;
  }

  login(idToken, user) {
    sessionStorage.setItem("id_token", idToken);
    sessionStorage.setItem("user", JSON.stringify(user));
  }

  logout() {
    sessionStorage.removeItem("id_token");
    sessionStorage.removeItem("user");
    window.location.assign("/");
  }
  #isTokenExpired(token) {
    // Decode the token to get its expiration time that was set by the server
    const decoded = decode(token);
    // If the expiration time is less than the current time (in seconds), the token is expired and we return `true`
    if (decoded.exp < Date.now() / 1000) {
      sessionStorage.removeItem("id_token");
      return true;
    }
    // If token hasn't passed its expiration time, return `false`
    return false;
  }

  getToken() {
    return sessionStorage.getItem("id_token");
  }
}

export default new AuthService();
