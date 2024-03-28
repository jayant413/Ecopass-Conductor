const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-[100vh]">
      <main className="h-[100vh]">{children}</main>
    </div>
  );
};

export default MainLayout;
