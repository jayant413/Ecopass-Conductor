"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useToast } from "./ui/use-toast";
import api from "@/helper/api";
import { useRouter } from "next/navigation";

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
  const { toast } = useToast();
  const router = useRouter();

  const reverseRouteName = () => {
    let sourceDest = assingnedBusDetials.routeName.split("-");
    let reversedStr = sourceDest.reverse().join("-");

    return reversedStr;
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

  return (
    <div className="w-full flex flex-col gap-y-10 justify-center items-center h-[100vh] dark:text-white dark:bg-black">
      <header className="flex flex-col items-center">
        <div className="flex gap-x-2 w-full justify-center text-xl">
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
      <div>
        <Button
          onClick={() => {
            handleStartJourney();
          }}
          disabled={journeyRoute.length == 0}
        >
          Strat Journey
        </Button>
      </div>
    </div>
  );
};

export default StartJourneyChoice;
