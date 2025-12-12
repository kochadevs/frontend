import NavigationBar from "../../components/common/NavigationBar";
import SideNavigation from "../../components/common/SideNavigation/SideNavigation";

export default function PagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="w-screen h-screen overflow-hidden flex flex-col">
      <NavigationBar />
      <div className="flex items-start">
        <SideNavigation />
        <div className="module-container overflow-x-hidden flex-1 bg-[#F9FAFB] h-screen overflow-y-scroll pb-[5rem]">
          {children}
        </div>
      </div>
    </section>
  );
}
