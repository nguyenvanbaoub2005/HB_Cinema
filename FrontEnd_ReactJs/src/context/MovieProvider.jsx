import { createContext, useState } from "react";
import PropType from "prop-types";
import Modal from "react-modal";
import YouTube from "react-youtube";

const opts = {
    height: "600",
    width: "900",
    playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay: 1,
    },
};

const MovieContext = createContext();

const MovieProvider = ({ children }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [trailerKey, setTrailerKey] = useState("");

    const handleTrailer = async (id) => {
        setTrailerKey('');
        
        // If the ID looks like a direct YouTube key (11 characters), use it directly
        if (id && id.length === 11) {
            setTrailerKey(id);
            setModalIsOpen(true);
            return;
        }

        try {
            const url = `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`;
            const options = {
                method: "GET",
                headers: {
                    accept: "application/json",
                    Authorization: `Bearer ${process.env.REACT_APP_TMDB_TOKEN}`,
                },
            };
            const movieKey = await fetch(url, options);
            const data = await movieKey.json();
            
            if (data.results && data.results.length > 0) {
                setTrailerKey(data.results[0].key);
            } else {
                setTrailerKey("dQw4w9WgXcQ"); 
            }
            setModalIsOpen(true);
        } catch (error) {
            console.error("Failed to fetch trailer, using fallback:", error);
            setTrailerKey("gL2q3t54hHQ"); // Generic fallback
            setModalIsOpen(true);
        }
    };
    return (
        <MovieContext.Provider value={{ handleTrailer }}>
            {children}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                style={{
                    overlay: {
                        position: "fixed",
                        zIndex: 9999,
                    },
                    content: {
                        top: "50%",
                        left: "50%",
                        right: "auto",
                        bottom: "auto",
                        marginRight: "-50%",
                        transform: "translate(-50%, -50%)",
                    },
                }}
                contentLabel="Example Modal"
            >
                <YouTube videoId={trailerKey} opts={opts} />
            </Modal>
        </MovieContext.Provider>
    )
};

MovieProvider.propType = {
    children: PropType.node,
}

export { MovieProvider, MovieContext }