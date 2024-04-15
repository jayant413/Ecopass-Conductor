import StartJourneyChoice from "@/components/StartJourneyChoice";
import api from "@/helper/api";
import { cookies } from "next/headers";

const StartJourney = async () => {
  const token = cookies().get("ecopass_conductor_token");

  const resposne = await api.get("/get-assignedBus", {
    headers: {
      Cookie: `ecopass_conductor_token = ${token?.value}`,
    },
  });

  const assingnedBusDetials = resposne.data.data.assignedBus;

  if (assingnedBusDetials)
    return <StartJourneyChoice assingnedBusDetials={assingnedBusDetials} />;
  else
    return (
      <div className="flex h-full  w-full justify-center items-center dark:text-white dark:bg-black">
        <span className="text-xl flex flex-col">
          <span className="font-bold underline">
            {assingnedBusDetials.conductorName}
          </span>{" "}
          you are not assigned to any bus yet.
        </span>
      </div>
    );
};

export default StartJourney;
