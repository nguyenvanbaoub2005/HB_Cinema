import React, { useState, useEffect } from "react";
import "./movie.css";
import DeleteMovie from "../modal-admin/DeleteMovie";
import AddMovie from "../modal-admin/AddMovie";
import EditMovie from "../modal-admin/EditMovie";
import { MdCalendarMonth, MdDelete, MdEdit } from "react-icons/md";
import AddScheduleByMovie from "../modal-admin/AddScheduleByMovie";
import { addScheduleByMovie } from "../../../api/apiSchedule";
import {
  addMovie,
  deleteMovie,
  getAllMovie,
  updateMovie,
} from "../../../api/apiMovie";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import Loading from "../../User/loading/Loading";
import { useNotificationModal } from "../../User/notificationModal/NotificationModal";

const Movie = () => {
  const [movies, setMovies] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddScheduleByMovie, setIsScheduleByMovie] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { openModal, ModalComponent } = useNotificationModal();


  useEffect(() => {
    fetchAllMovie();
  }, []);

  const fetchAllMovie = async () => {
    try {
      setError(null);
      const data = await getAllMovie();
      setMovies(data.result);
      setLoading(false);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleAddMovie = async (movie) => {
    try {
      setError(null);
      await addMovie(movie);
      fetchAllMovie();
      openModal({
        type: 'success',
        title: 'Movie Added',
        message: 'The movie has been added successfully!',
      });
    } catch (error) {
      setError(error.message);
      openModal({
        type: 'error',
        title: 'Error Adding Movie',
        message: `An error occurred: ${error.message}`,
      });
    }
  };
  

  const handleUpdateMovie = async (id, updatedMovie) => {
    try {
      setError(null);
      await updateMovie(id, updatedMovie);
      fetchAllMovie();
      openModal({
        type: 'success',
        title: 'Movie Updated',
        message: 'The movie has been updated successfully!',
      });
    } catch (error) {
      setError(error.message);
      openModal({
        type: 'error',
        title: 'Error Updating Movie',
        message: `An error occurred: ${error.message}`,
      });
    }
  };
  

  const handleDeleteMovie = async (id) => {
    try {
      setError(null);
      await deleteMovie(id);
      fetchAllMovie();
      openModal({
        type: 'success',
        title: 'Movie Deleted',
        message: 'The movie has been deleted successfully!',
      });
    } catch (error) {
      setError(error.message);
      openModal({
        type: 'error',
        title: 'Error Deleting Movie',
        message: `An error occurred: ${error.message}`,
      });
    }
  };
  

  const handleAddScheduleByMovie = async (id, newSchedule) => {
    try {
      setError(null);
      await addScheduleByMovie(id, newSchedule);
      openModal({
        type: 'success',
        title: 'Schedule Added',
        message: 'The schedule has been added successfully!',
      });
    } catch (error) {
      setError(error.message);
      openModal({
        type: 'error',
        title: 'Error Adding Schedule',
        message: `An error occurred: ${error.message}`,
      });
    }
  };
  

  if (loading) {
    return <Loading text="Loading movie list..."/>
  }

  return (
    <div className="movie-container">
      <ModalComponent />
    
      <div className="movie-table-container">
        <PerfectScrollbar
          style={{ maxHeight: "570px", overflowX: "auto", width: "100%" }}
        >
          <table className="movie-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Image</th>
                <th>Movie Name</th>
                <th>Over View</th>
                <th><button
            className="add-movie-button"
            onClick={() => setIsAddModalOpen(true)}
          >
          Add Movie 
          </button></th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie) => (
                <tr key={movie.id}>
                  <td>{movie.id}</td>
                  <td>
                    <img
                      src={movie.image}
                      alt={movie.title}
                      className="movie-thumbnail"
                    />
                  </td>
                  <td>{movie.title}</td>
                  <td>{movie.overView}</td>
                  <td className="action-buttons">
                    <button
                      className="edit-button"
                      onClick={() => {
                        setSelectedMovie(movie);
                        setIsEditModalOpen(true);
                      }}
                    >
                      <MdEdit />
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => {
                        setSelectedMovie(movie);
                        setIsDeleteModalOpen(true);
                      }}
                    >
                      <MdDelete />
                    </button>
                    <button
                      className="schedule-button"
                      onClick={() => {
                        setSelectedMovie(movie);
                        setIsScheduleByMovie(true);
                      }}
                    >
                      <MdCalendarMonth />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </PerfectScrollbar>
      </div>

      {isAddModalOpen && (
        <AddMovie
          onClose={() => setIsAddModalOpen(false)}
          onSave={(newMovie) => {
            handleAddMovie(newMovie);
            setIsAddModalOpen(false);
          }}
        />
      )}
      {isEditModalOpen && selectedMovie && (
        <EditMovie
          movie={selectedMovie}
          onClose={() => setIsEditModalOpen(false)}
          onSave={(updatedMovie) => {
            handleUpdateMovie(selectedMovie.id, updatedMovie);
            setIsEditModalOpen(false);
          }}
        />
      )}
      {isDeleteModalOpen && selectedMovie && (
        <DeleteMovie
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={() => {
            handleDeleteMovie(selectedMovie.id);
            setIsDeleteModalOpen(false);
          }}
        />
      )}

      {isAddScheduleByMovie && (
        <AddScheduleByMovie
          onClose={() => setIsScheduleByMovie(false)}
          onSave={(newSchedule) => {
            handleAddScheduleByMovie(selectedMovie.id, newSchedule);
            setIsScheduleByMovie(false);
          }}
        />
      )}
    </div>
  );
};

export default Movie;
