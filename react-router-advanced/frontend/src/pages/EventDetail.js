import React, { Suspense } from "react";
import { Await, defer, json, redirect, useRouteLoaderData } from "react-router-dom";

import EventItem from "../components/EventItem";
import EventsList from "../components/EventsList";

const EventDetailPage = () => {
  const { event, events } = useRouteLoaderData("event-detail");

  return (
    <>
      <Suspense fallback={<p style={{ textAlign: "center" }}>Loading...</p>}>
        <Await resolve={event}>{(loadedEvent) => <EventItem event={loadedEvent} />}</Await>
      </Suspense>
      <Suspense fallback={<p style={{ textAlign: "center" }}>Loading...</p>}>
        <Await resolve={events}>{(loadedEvents) => <EventsList events={loadedEvents} />}</Await>
      </Suspense>
    </>
  );
};

const loadEvent = async (id) => {
  const response = await fetch("http://localhost:8080/events/" + id);

  if (!response.ok) {
    throw json({ message: "Could not fetch details for selected event." }, { status: 500 });
  } else {
    const resData = await response.json();
    return resData.event;
  }
};

const loadEvents = async () => {
  const response = await fetch("http://localhost:8080/events");

  if (!response.ok) {
    // throw new Response(JSON.stringify({ message: "Could not fetch events." }), { status: 500 });
    return json({ message: "Could not fetch events." }, { status: 500 });
  } else {
    const resData = await response.json();
    return resData.events;
  }
};

export default EventDetailPage;

export const loader = async ({ params }) => {
  const id = params.eventId;

  return defer({
    event: await loadEvent(id),
    events: loadEvents(),
  });
};

export const action = async ({ request, params }) => {
  const response = await fetch("http://localhost:8080/events/" + params.eventId, {
    method: request.method,
  });

  if (!response.ok) {
    throw json({ message: "Could not delete event." }, { status: 500 });
  } else {
    return redirect("/events");
  }
};
