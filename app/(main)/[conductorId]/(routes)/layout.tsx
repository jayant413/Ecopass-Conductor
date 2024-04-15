import Header from "@/components/Header";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-[100vh]">
      <div className="h-[8vh]">
        {" "}
        <Header />
      </div>
      <hr className="h-[0.3vh] bg-gray-200" />
      <main className="h-[91.7vh] w-full  overflow-y-auto">{children}</main>
    </div>
  );
};

export default MainLayout;
