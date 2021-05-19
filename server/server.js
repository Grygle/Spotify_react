const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

const credentials = {

}

app.post('/login', (req, res) => {
    const code = req.body.code
    const spotifyApi = new SpotifyWebApi(credentials)

    spotifyApi.authorizationCodeGrant(code).then(data => {
        res.json({
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIs: data.body.expires_in
        }).catch(() => {
            res.sendStatus(400)
        })
    })
})