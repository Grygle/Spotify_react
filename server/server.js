require('dotenv').config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const lyricsFinder = require('lyrics-finder');
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const credentials = {
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
};

app.post("/login", (req, res) => {
    const code = req.body.code;
    const spotifyApi = new SpotifyWebApi(credentials);

    spotifyApi
        .authorizationCodeGrant(code)
        .then((data) => {
            res.json({
                accessToken: data.body.access_token,
                refreshToken: data.body.refresh_token,
                expiresIn: data.body.expires_in,
            });
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(400);
        });
});

app.post("/refresh", (req, res) => {

    const spotifyApi = new SpotifyWebApi(credentials)
    // const refreshToken = req.body.refreshToken;
    // const spotifyApi = new SpotifyWebApi({
    //     redirectUri: ,
    //     clientId: ,
    //     clientSecret: ,
        // refreshToken
    // });
    spotifyApi.setRefreshToken(req.body.refreshToken);

    spotifyApi
        .refreshAccessToken()
        .then((data) => {
            console.log(data.body.accessToken, 'body')
            // console.log("The access token has been refreshed!");

            res.json({
                // accessToken: data.body.accessToken,
                // exporesIn: data.body.expiresIn
                accessToken: data.body.access_token,
                exporesIn: data.body.expires_in
            })
        })
        .catch((err) => {
            res.sendStatus(400)
        });
});

app.get("/lyrics", async (req, res) => {
    const lyrics = await lyricsFinder(req.query.artist, req.query.track) || "No lyrics found.";
    res.json({ lyrics });
})

app.listen(3001);
