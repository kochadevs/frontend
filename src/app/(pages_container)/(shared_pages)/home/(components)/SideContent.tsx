import EventsComponent from "./EventsComponent";
import MentorMenteeComponent from "./MentorMenteeComponent";

export default function SideContent() {
  return (
    <div className="w-full space-y-6 py-3">
      <MentorMenteeComponent
        maxItems={6}
        showConnectButton={true}
        showViewAll={true}
      />

      <EventsComponent maxEvents={3} />
    </div>
  );
}
