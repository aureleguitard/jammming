const clientId = 'f7e93f7e59014ade97b7871349ba4a97';
// eslint-disable-next-line no-unused-vars
const redirectUri = 'http://localhost:3000/';

let accessToken = '';
export const Spotify = {
    getAccessToken() {
        if (accessToken) {
            return accessToken;
        }

        // check for access token match
        const userAccessToken = window.location.href.match(/access_token=([^&]*)/);
        const expiredToken = window.location.href.match(/expires_in=([^&]*)/);

        if (userAccessToken && expiredToken) {
            accessToken = userAccessToken[1];
            const expiresIn = Number(expiredToken[1]);

            // this clears params, allow grab new access token when it expires
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else {
            const redirectUri = 'http://localhost:3000/';
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
            window.location = accessUrl;
        }
    },

    search(term) {
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            if (!jsonResponse.tracks) {
                return [];
            }
            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artits[0].name,
                album: track.album.name,
                uri: track.uri
            }));
        });

    },

    savePlaylist(name, trackUris) {
        if (!name || trackUris) {
            return;
        }
        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}`}
    }
}



export default Spotify;