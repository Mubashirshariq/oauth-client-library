# OAuth2 Client
OAuth2 Client is a library for OAuth 2.0 authorization.
## Supported Providers (For now)
- **Google**
### Install
To test the library, run the following command:
```bash
git clone https://github.com/vikashsprem/oauth2-client.git
```
1. Test server side oauth2.0
   ```base
    cd projects/backend/
    npm install
   ```
- Go to http://localhost:3000/login
2. Test Client side oauth2.0
   ```base
   cd projects/frontnd/
   npm install
   ```
- Go to http://localhost:5173
## Set Environment Variables
Create a .env file in the root directory of your project and add the following properties for Google OAuth2:
```base
CLIENT_ID=<YOUR_CLIENT_ID>
CLIENT_SECRET=<YOUR_CLIENT_SECRET>
```
## Example: Express.js Implementation
Here’s an example of how to use the OAuth2 client with an Express.js server.
```javascript
const express = require("express");
const client = require("@changheedev/oauth2-client");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
app.use(express.json());
// Login Route: Initiates the OAuth flow
app.get("/login", (req, res) => {
  const authUrl = client.startAuthFlow(["profile", "email"], "randomState");
  console.log(authUrl);
  res.json({
    message: "Successful login",
    authUrl,
  });
});
// Callback Route: Handles the OAuth callback and fetches user info
app.get("/callback", async (req, res) => {
  const { code } = req.query;
  try {
    const tokens = await client.handleCallback({ code });
    const userInfo = await client.getUserInfo(tokens.access_token);
    res.json({ message: "Authentication successful", user: userInfo, tokens });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error in OAuth flow", error: error.message });
  }
});
// Refresh Token Route: Handles refreshing the OAuth token
app.post("/refresh-token", async (req, res) => {
  const { refreshToken } = req.body;
  try {
    const tokens = await client.refreshToken(refreshToken);
    res.json({ message: "Token refreshed successfully", tokens });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error refreshing token", error: error.message });
  }
});
// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
```
### Notes:
Replace `<YOUR_CLIENT_ID>`, `<YOUR_CLIENT_SECRET>`, and `<YOUR_CALLBACK_URI>` with your actual Google OAuth 2.0 credentials and callback URI.
- The `/login` route generates the authorization URL for Google OAuth2.
- The `/callback` route handles the response from Google after the user authenticates, exchanging the authorization code for an access token.
- The `/refresh-token` route allows you to refresh an expired access token using the refresh token.
### Optional
If you're running the server locally, make sure the following ports are open:
- OAuth Redirect URI: http://localhost:3000/callback
