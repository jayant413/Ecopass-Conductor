"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useToast } from "./ui/use-toast";
import api from "@/helper/api";
import { redirect, useRouter } from "next/navigation";
import useSWR from "swr";

interface assginedBusProps {
  _id: string;
  busNumber: string;
  routeNumber: string;
  routeName: string;
  conductorName: string;
  busRouteID: string;
  conductorID: string;
  // createdAt: string,
  // updatedAt: string
}

const StartJourneyChoice = ({ assingnedBusDetials }: any) => {
  const [journeyRoute, setJourneyRoute] = useState<String>("");
  const [busRoute, setBusRoute] = useState<any>([]);
  const [resumePreviousJourney, setResumePreviousJourney] =
    useState<boolean>(false);
  const { toast } = useToast();
  const router = useRouter();

  const reverseRouteName = () => {
    let sourceDest = assingnedBusDetials.routeName.split("-");
    let reversedStr = sourceDest.reverse().join("-");
    return reversedStr;
  };

  const fetchBusRoute = async (url: string) => {
    const busRouteDetails: any = await api.get(url);
    const previousJourney = assingnedBusDetials.journey[0];
    const all_Stops = busRouteDetails.data.data.busRoute.all_stops;

    setBusRoute(busRouteDetails.data.data.busRoute);
    setResumePreviousJourney(previousJourney.length !== all_Stops.length);
  };

  const handleStartJourney = async () => {
    try {
      const response: any = await api.post("/start-journey", {
        journeyRoute: journeyRoute,
        busId: assingnedBusDetials._id,
      });

      const routeStoD = journeyRoute.split("-");

      if (response.data.success) {
        toast({ title: "Started journey successfully." });
        router.push(
          `/${assingnedBusDetials.conductorID}/${routeStoD[0]}/to/${routeStoD[1]}`
        );
      }
    } catch (error) {
      console.log(error);
      toast({ title: "Something went wrong." });
    }
  };

  useEffect(() => {
    fetchBusRoute(`/get-bus-route-details/${assingnedBusDetials.busRouteID}`);
  }, []);

  const handleResumeJourney = async () => {
    const previousJourney = assingnedBusDetials.journey[0];

    if (previousJourney[0].stop == busRoute.source) {
      router.push(
        `/${assingnedBusDetials.conductorID}/${busRoute.source}/to/${busRoute.destination}`
      );
    } else if (previousJourney[0].stop == busRoute.destination) {
      router.push(
        `/${assingnedBusDetials.conductorID}/${busRoute.destination}/to/${busRoute.source}`
      );
    }
  };

  return (
    <div className="w-full flex flex-col gap-y-10 justify-center items-center h-[100%] dark:text-white dark:bg-black">
      <header className="flex flex-col items-center">
        <div className="flex md:flex-row flex-col gap-x-2 w-full justify-center text-xl">
          <span className="font-bold underline">
            {assingnedBusDetials.conductorName}
          </span>{" "}
          you are assigned to Bus :{" "}
          <span className="font-bold underline">
            {assingnedBusDetials.busNumber}
          </span>
        </div>
        <span className="text-gray-800 text-lg mt-3">
          Choose a journey to start
        </span>
      </header>

      <div>
        <div className="flex">
          <Input
            type="radio"
            className="h-6 w-6 mt-1 cursor-pointer"
            name="chooseJourney"
            onChange={(e) => {
              setJourneyRoute(e.target.value);
            }}
            value={assingnedBusDetials.routeName}
          />
          <Label className="text-2xl ml-2">
            {assingnedBusDetials.routeName}
          </Label>
        </div>
        <div className="flex ">
          <Input
            type="radio"
            className="h-6 w-6 mt-1 cursor-pointer"
            name="chooseJourney"
            onChange={(e) => {
              setJourneyRoute(e.target.value);
            }}
            value={reverseRouteName()}
          />
          <Label className="text-2xl ml-2">{reverseRouteName()}</Label>
        </div>
      </div>
      <div className="flex flex-col gap-y-4">
        <Button
          onClick={() => {
            handleStartJourney();
          }}
          disabled={journeyRoute.length == 0}
        >
          Start Journey
        </Button>
        {resumePreviousJourney ? (
          <Button
            onClick={() => {
              handleResumeJourney();
            }}
          >
            Resume Privious Journey
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default StartJourneyChoice;
