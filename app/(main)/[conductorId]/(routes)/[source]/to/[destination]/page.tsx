"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import api from "@/helper/api";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";

interface stopsProp {
  stopName: string;
  checked: boolean;
}

const Journey = () => {
  const [stops, setStops] = useState<stopsProp[]>([
    {
      stopName: "",
      checked: false,
    },
  ]);
  const [checkedStops, setCheckedStops] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allChecked, setAllChecked] = useState(false);
  const { toast } = useToast();
  const { source, destination, conductorId } = useParams();
  const router = useRouter();

  const fetchAssignedBus = async (url: string) => {
    const assignedBus = await api.get(url);
    const routeId = assignedBus.data.data.assignedBus.busRouteID;

    const busRoute = await api.get(`/get-bus-route-details/${routeId}`);
    const busDetails = await api.get("/get-assignedBus");
    setCheckedStops(busDetails.data.data.assignedBus.journey[0]);

    let extractStops: stopsProp[] = [];
    busRoute.data.data.busRoute.all_stops.forEach(
      (stopName: string, index: number) => {
        extractStops.push({
          stopName: stopName,
          checked: false,
        });
      }
    );

    if (source == extractStops[0].stopName) setStops(extractStops);
    else {
      extractStops.reverse();
      setStops(extractStops);
    }

    return busRoute.data.data.busRoute;
  };

  const { data, error, isLoading } = useSWR(
    "/get-assignedBus",
    fetchAssignedBus
  );

  useEffect(() => {
    let newStops = [...stops];
    checkedStops.forEach((checkedStop: any, index) => {
      stops.forEach((stop: any, index) => {
        if (checkedStop.stop === stop.stopName) {
          newStops[index].checked = true;
        }
      });
    });
    setStops(newStops);
  }, [checkedStops]);

  useEffect(() => {
    let count = 0;
    stops.forEach((stop: any, index: number) => {
      if (stop.checked == true) count++;
    });
    if (count === stops.length) setAllChecked(true);
  }, [stops]);

  const GET_CheckNextStop = async () => {
    setIsSubmitting(true);
    try {
      const response = await api.get(
        `/check-next-stop/${source}/to/${destination}`
      );

      if (response.data.success) {
        router.refresh();
        mutate("/get-assignedBus");
      } else {
        toast({ title: "Due to some issue not able to check next stop." });
      }
    } catch (error) {
      console.log(error);
      toast({ title: "Something went wrong." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full  flex flex-col gap-y-5  justify-center items-center">
      <div className="flex flex-col">
        {stops.map((stop: stopsProp, index: number) => {
          return (
            <div key={index} className="flex gap-x-3">
              <Input
                type="checkbox"
                className="h-4 w-4 mt-1 bg-yellow-500 text-red-500"
                checked={stop.checked}
              />
              <span>Stop {index + 1} : </span>
              <span>{stop.stopName}</span>
            </div>
          );
        })}
      </div>
      {allChecked ? (
        <Button
          disabled={isSubmitting}
          onClick={() => {
            setIsSubmitting(true);
            toast({ title: "Journey completed successfully." });
            setTimeout(() => {
              router.push(`/${conductorId}/start-journey`);
            }, 1000);
          }}
        >
          {isSubmitting ? "Exiting..." : "Exit Journey"}
        </Button>
      ) : (
        <Button onClick={GET_CheckNextStop} disabled={isSubmitting}>
          {" "}
          {isSubmitting ? "Checking..." : "Check next stop"}
        </Button>
      )}
    </div>
  );
};

export default Journey;
