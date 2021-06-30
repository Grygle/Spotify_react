import React from "react";
import { Container, Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import SpotifyWebApiNode from "spotify-web-api-node";
import useAuthorization from "./useAuthorization";
import TrackSearchResult from "./TrackSearchResult";
import Player from "./Player";
import axios from "axios";

const spotifyApi = new SpotifyWebApiNode({
    clientId: "",
});

export default function Dashboard({ code }) {
    const accessToken = useAuthorization(code);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [playingTrack, setPlayingTrack] = useState();
    const [lyrics, setLyrics] = useState("");


    function chooseTrack(track) {
        setPlayingTrack(track);
        setSearch("");
        setLyrics("");
    }

    useEffect(() => {
        if(!playingTrack) return;

        axios.get("http://localhost:3001/lyrics", {
            params: {
                track: playingTrack.title,
                artists: playingTrack.artist
            }
        }).then(response => {
            setLyrics(response.data.lyrics)
        })
    }, [playingTrack])

    useEffect(() => {
        if (!accessToken) return;
        spotifyApi.setAccessToken(accessToken);
    }, [accessToken]);

    useEffect(() => {
        if (!search) return setSearchResult([]);
        if (!accessToken) return;
        let cancel = false;

        spotifyApi.searchTracks(search).then((response) => {
            if (cancel) return;
            setSearchResult(
                response.body.tracks.items.map((track) => {
                    const smallestImage = track.album.images.reduce(
                        (smallest, image) => {
                            if (image.height < smallest.height) return image;
                            return smallest;
                        },
                        track.album.images[0]
                    );

                    return {
                        artist: track.artists[0].name,
                        title: track.name,
                        uri: track.uri,
                        albumUrl: smallestImage.url,
                    };
                })
            );
        });
        return () => (cancel = true);
    }, [search, accessToken]);

    return (
        <Container
            className="d-flex flex-column py-3"
            style={{ height: "100vh" }}
        >
            <Form.Control
                type="search"
                placeholder="Search songs"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <div className="flex-grow-1 my-3" style={{ overflowY: "auto" }}>
                {searchResult.map((result) => (
                    <TrackSearchResult
                        track={result}
                        key={result.uri}
                        chooseTrack={chooseTrack}
                    />
                ))}
                {searchResult.length === 0 && (
                    <div className="text-center" style={{ whiteSpace: "pre" }}>
                        {lyrics}
                        </div>
                )}
            </div>
            <div>
                <Player
                    accessToken={accessToken}
                    // of track exists it takes uri
                    trackUri={playingTrack?.uri}
                />
            </div>
        </Container>
    );
}
