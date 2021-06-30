import React from "react";

export default function TrackSearchResult({ track, chooseTrack }) {
    function playHandler() {
        chooseTrack(track)
    }
    return (
        <div
            className="d-flex m-2 allign-items-center"
            style={{ cursor: "pointer" }}
            onClick={playHandler}
        >
            <img
                src={track.albumUrl}
                style={{ height: "64px", width: "64px" }}
                alt="track"
            />
            <div className="m-2">
                <div>{track.title}</div>
                <div className="text-muted">{track.artist}</div>
            </div>
        </div>
    );
}
