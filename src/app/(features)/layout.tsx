import OnBoardingNavbar from "../../components/common/OnBoardingNavbar";
import SideNavigation from "../../components/common/SideNavigation/SideNavigation";

export default function PagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="flex items-start w-screen overflow-hidden">
      <SideNavigation />
      <div className="module-container  flex-1 bg-[#F2F5F9] h-screen overflow-y-scroll">
        <OnBoardingNavbar />
        <div className="md:p-[1rem] overflow-y-scroll flex-1">{children}</div>
      </div>
    </section>
  );
}
