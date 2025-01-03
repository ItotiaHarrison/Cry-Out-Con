import { Suspense } from "react";
import bgImage from "../assets/backgroundimages/IMG_6543.jpg";
import LazyImage from "./LazyImage";
import SectionTitle from "./SectionTitle";
interface AgendaDay {
  day: string;
  sessions: { time: string; title: string }[];
}

const agenda: { announcement: string; days: AgendaDay[] } = {
  announcement: "Detailed Schedule to be announced on March 17",
  days: [
    {
      day: "Thursday May 01",
      sessions: [
        { time: "7:30 PM - 10:00 PM", title: "Opening Night Session" },
      ],
    },
    {
      day: "Friday May 02",
      sessions: [
        {
          time: "10:00 AM - 5:00 PM",
          title:
            "Praise & Worship, Breakouts, Keynote Addresses, Conversations",
        },
        {
          time: "7:00 PM - 10:00 PM",
          title: "Evening Keynote Session with Musical Guest",
        },
      ],
    },
    {
      day: "Saturday May 03",
      sessions: [
        { time: "8:00 AM", title: "Wellness Session" },
        {
          time: "10:00 AM - 5:00 PM",
          title: "Praise & Worship, Breakouts, Keynote Addresses",
        },
        { time: "7:00 PM - 10:00 PM", title: "Evening Musical Performances" },
      ],
    },
    {
      day: "Sunday May 04",
      sessions: [{ time: "10:00 AM", title: "Closing Session" }],
    },
  ],
};

const Agenda = () => {
  return (
    <section id="agenda" className="py-16 relative overflow-hidden">
      <div className="absolute inset-0">
        <Suspense
          fallback={
            <div className="absolute inset-0 w-full h-full bg-gray-900 animate-pulse" />
          }
        >
          <LazyImage
            src={bgImage}
            alt="Background"
            className="w-full h-full object-cover"
            style={{
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
        </Suspense>
      </div>
      <div className="container mx-auto px-4 relative">
        <SectionTitle
          title="CONFERENCE SCHEDULE"
          subtitle="Detailed schedule to be announced on March 17"
        />

        <div className="bg-white w-full max-w-3xl mx-auto rounded-2xl border border-gray-200 shadow-lg p-4 md:p-6">
          {agenda.days.map((day, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-xl font-semibold text-purple-600 mb-2">
                {day.day}
              </h3>
              <hr className="border-t border-gray-300 mb-4" />
              {day.sessions.map((session, idx) => (
                <div key={idx} className="flex space-x-7 mb-2">
                  <span className="md:text-md text-sm font-semibold text-gray-700 min-w-[150px]">
                    {session.time}
                  </span>
                  <p className="text-gray-700 text-sm md:text-md">
                    {session.title}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Agenda;
