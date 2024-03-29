import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";

import { fetchEvent, queryClient, updateEvent } from "../../util/http.js";

import Modal from "../UI/Modal.jsx";
import EventForm from "./EventForm.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";

export default function EditEvent() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data, isError, error } = useQuery({
    queryFn: ({ signal }) => fetchEvent({ signal, id }),
    queryKey: ["events", { id }],
    staleTime: 10000,
  });

  const { mutate } = useMutation({
    mutationFn: updateEvent,
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["events", { id }] });
      const previousEvent = queryClient.getQueryData(["events", { id }]);

      queryClient.setQueryData(["events", { id }], data.event);

      return { previousEvent };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(["events", { id }], context.previousEvent);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["events", { id }]);
    },
  });

  function handleSubmit(formData) {
    mutate({ id, event: formData });
    navigate("../");
  }

  function handleClose() {
    navigate("../");
  }

  let content;

  if (isError) {
    content = (
      <>
        <ErrorBlock
          title='Failed to load event'
          message={
            error.info?.message ||
            "Failed to load event. Please check your inputs and try again later."
          }
        />
        <div className='form-actions'>
          <Link
            to='../'
            className='button'
          >
            Okay
          </Link>
        </div>
      </>
    );
  }

  if (data) {
    content = (
      <EventForm
        inputData={data}
        onSubmit={handleSubmit}
      >
        <Link
          to='../'
          className='button-text'
        >
          Cancel
        </Link>
        <button
          type='submit'
          className='button'
        >
          Update
        </button>
      </EventForm>
    );
  }

  return <Modal onClose={handleClose}>{content}</Modal>;
}

export const Loader = ({ params }) => {
  return queryClient.fetchQuery({
    queryFn: ({ signal }) => fetchEvent({ signal, id: params.id }),
    queryKey: ["events", { id: params.id }],
  });
};

// export const action = async ({ request, params }) => {
//   const formData = await request.formData();
//   const updatedEventData = Object.fromEntries(formData);
//   await updateEvent({ id: params.id, event: updatedEventData });
//   await queryClient.invalidateQueries(["events"]);
//   return redirect("../");
// };

