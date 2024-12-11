const express = require('express');
const OAuthClient = require('../../core/src/index.js')
require('dotenv').config();

const app = express();

app.use(express.json());

const client = new OAuthClient({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: 'http://localhost:3000/callback',
  userInfoEndpoint: 'https://openidconnect.googleapis.com/v1/userinfo',
  provider: "google"
});


app.get('/login', (req, res) => {
  const authUrl = client.startAuthFlow(['profile', 'email'], 'randomState');
  console.log(authUrl)
  res.redirect(authUrl);
});

app.get('/callback', async (req, res) => {
  const { code } = req.query;

  try {
    const tokens = await client.handleCallback({ code });
    const userInfo = await client.getUserInfo(tokens.access_token);
    res.json({ message: 'Authentication successful', user: userInfo, tokens });
  } catch (error) {
    res.status(500).json({ message: 'Error in OAuth flow', error: error.message });
  }
});

app.post('/refresh-token', async (req, res) => {
  const { refreshToken } = req.body;

  try {
    const tokens = await client.refreshToken(refreshToken);
    res.json({ message: 'Token refreshed successfully', tokens });
  } catch (error) {
    res.status(500).json({ message: 'Error refreshing token', error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
