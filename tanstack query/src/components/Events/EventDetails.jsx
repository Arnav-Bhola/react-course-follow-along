import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";

import { deleteEvent, fetchEvent, queryClient } from "../../util/http.js";

import Header from "../Header.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import { useState } from "react";
import Modal from "../UI/Modal.jsx";

export default function EventDetails() {
  const [isDeleting, setIsDeleting] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isError, error, isPending } = useQuery({
    queryFn: ({ signal }) => fetchEvent({ id, signal }),
    queryKey: ["events", { id }],
  });

  const {
    mutate,
    isPending: isPendingDeletion,
    isError: isErrorDeleting,
    error: errorDelete,
  } = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"], refetchType: "none" });
      navigate("/events");
    },
  });

  const handleStartDelete = () => {
    setIsDeleting(true);
  };

  const handleStopDelete = () => {
    setIsDeleting(false);
  };

  const deleteHandler = () => {
    mutate({ id });
  };

  return (
    <>
      {isDeleting && (
        <Modal onClose={handleStopDelete}>
          <h2>Are you sure?</h2>
          <p>Do you really want to delete this event? This action cannot be undone.</p>
          <div className='form-actions'>
            {isPendingDeletion && <p>Deleting, please wait....</p>}
            {!isPendingDeletion && (
              <>
                <button
                  onClick={handleStopDelete}
                  className='button-text'
                >
                  Cancel
                </button>
                <button
                  onClick={deleteHandler}
                  className='button'
                >
                  Delete
                </button>
              </>
            )}
          </div>
          {isErrorDeleting && (
            <ErrorBlock
              title='Failed to delete event'
              message={
                errorDelete.info?.message || "Failed to delete event, please try again later."
              }
            />
          )}
        </Modal>
      )}
      <Outlet />
      <Header>
        <Link
          to='/events'
          className='nav-item'
        >
          View all Events
        </Link>
      </Header>
      <article id='event-details'>
        {data && (
          <>
            <header>
              <h1>{data.title}</h1>
              <nav>
                <button onClick={handleStartDelete}>Delete</button>
                <Link to='edit'>Edit</Link>
              </nav>
            </header>
            <div id='event-details-content'>
              <img
                src={`http://localhost:3000/${data.image}`}
                alt={data.title}
              />
              <div id='event-details-info'>
                <div>
                  <p id='event-details-location'>{data.location}</p>
                  <time dateTime={`${data.date}T${data.time}`}>
                    {new Date(data.date).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}{" "}
                    @ {data.time}
                  </time>
                </div>
                <p id='event-details-description'>{data.description}</p>
              </div>
            </div>
          </>
        )}
        {isError && (
          <div
            id='event-details-content'
            className='center'
          >
            <ErrorBlock
              title='Failed to load event'
              message={error.info?.message || "Failed to fetch event data, please try again later."}
            />
          </div>
        )}
        {isPending && (
          <div
            id='event-details-content'
            className='center'
          >
            <p>Fetching event data...</p>
          </div>
        )}
      </article>
    </>
  );
}

