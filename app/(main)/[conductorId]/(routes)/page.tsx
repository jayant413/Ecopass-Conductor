"use client";

import { useParams, useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();
  const { conductorId } = useParams();

  router.push(`/${conductorId}/start-journey`);

  return (
    <div>
      <div>
        <span>Ecopass Conductor platform</span>
      </div>
    </div>
  );
};

export default Home;
