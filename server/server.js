const express = require("express");
const cors = require("cors");
//const bodyParser = require("body-parser");
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();
app.use(cors());
app.use(express.json());
//app.use(bodyParser.json());

const credentials = {

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

app.listen(3001);
