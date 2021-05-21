const express = require('express');
const cors = require('cors');
//const bodyParser = require("body-parser");
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();
app.use(cors());
app.use(express.json());
//app.use(bodyParser.json());

const credentials = {

}

app.post('/login', (req, res) => {
    const code = req.body.code
    const spotifyApi = new SpotifyWebApi(credentials)

    spotifyApi
        .authorizationCodeGrant(code)
        .then(data => {
            res.json({
                accessToken: data.body.access_token,
                refreshToken: data.body.refresh_token,
                expiresIs: data.body.expires_in
            })
        })
        .catch(err => {
                console.log(err)
                res.sendStatus(400)

        })
});

app.listen(3001);