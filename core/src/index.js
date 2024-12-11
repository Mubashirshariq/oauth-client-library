const browserEnvironment = require('./browser.js');
const serverEnvironment = require('./server.js');

class OAuthClient {
    constructor(config) {
        const { clientId, clientSecret, redirectUri, provider } = config;

        console.log(clientId, clientSecret, redirectUri, provider)

        if (!clientId || !redirectUri || !provider) {
            throw new Error('Missing required configuration: clientId, redirectUri, or provider');
        }

        this.clientId = clientId;
        this.clientSecret = clientSecret || null;
        this.redirectUri = redirectUri;
        this.providerConfig = require(`./providers/${provider}.js`);
        this.environment = typeof window !== 'undefined' ? browserEnvironment : serverEnvironment;
    }

    startAuthFlow(scope, state) {

        console.log(scope, state)

        const queryParams = new URLSearchParams({
            client_id: this.clientId,
            redirect_uri: this.redirectUri,
            response_type: 'code',
            scope: scope.join(' '),
            state,
        });
        return `${this.providerConfig.authorizationEndpoint}?${queryParams}`;
    }

    async handleCallback({ code }) {
        const response = await fetch(this.providerConfig.tokenEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                client_id: this.clientId,
                client_secret: this.clientSecret,
                redirect_uri: this.redirectUri,
                grant_type: 'authorization_code',
                code,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to exchange authorization code for tokens');
        }

        const tokens = await response.json();
        this.environment.saveToken('tokens', tokens);
        return tokens;
    }

    async refreshAccessToken({ refreshToken }) {
        const response = await fetch(this.providerConfig.tokenEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                client_id: this.clientId,
                client_secret: this.clientSecret,
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to refresh access token');
        }

        const tokens = await response.json();
        this.environment.saveToken('tokens', tokens);
        return tokens;
    }

    async getUserInfo(accessToken) {
        const userInfoUri = "https://openidconnect.googleapis.com/v1/userinfo";
        try {
            const response = await fetch(userInfoUri, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (!response.ok) {
                throw new Error(`Error fetching user info: ${response.status} - ${response.statusText}`);
            }
            const userInfo = await response.json();
            return {
                provider: this.provider,
                ...userInfo, // Include all user info fields
            };
        } catch (error) {
            console.error("Error in getUserInfo:", error);
            throw error;
        }
    }

    getSavedTokens() {
        return this.environment.getToken('tokens');
    }
}

module.exports = OAuthClient;
