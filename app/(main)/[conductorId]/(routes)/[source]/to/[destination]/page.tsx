"use client";

import api from "@/helper/api";
import { useState } from "react";
import useSWR from "swr";

const Journey = () => {
  const [stops, setStops] = useState([]);

  const fetchAssignedBus = async (url: string) => {
    const assignedBus = await api.get(url);
    const routeId = assignedBus.data.data.assignedBus.busRouteID;

    console.log(routeId);

    const busRoute = await api.get(`/get-bus-route-details/${routeId}`);
    setStops(busRoute.data.data.busRoute.all_stops);
    return busRoute.data.data.busRoute;
  };

  const { data, error, isLoading } = useSWR(
    "/get-assignedBus",
    fetchAssignedBus
  );

  return (
    <div className="bg-blue-200 h-full flex  justify-center items-center">
      <div className="flex flex-col">
        {stops.map((stop: string, index: number) => {
          return <span>{stop}</span>;
        })}
      </div>
    </div>
  );
};

export default Journey;
