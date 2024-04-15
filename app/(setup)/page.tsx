import api from "@/helper/api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const token = cookies().get("ecopass_conductor_token");

  if (!token) redirect("/login");

  if (token) {
    const resposne = await api.get("/get-assignedBus", {
      headers: {
        Cookie: `ecopass_conductor_token = ${token?.value}`,
      },
    });

    if (resposne.data.success) {
      const data = resposne.data.data;
      redirect(`/${data.conductorID}/start-journey`);
    } else {
      redirect("/login");
    }
  } else {
    redirect("/login");
  }

  return (
    <div>
      <span>Ecopass Loading...</span>
    </div>
  );
}
