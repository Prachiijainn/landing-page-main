import Navigation from "@/components/Navigation";
import EventsSection from "@/components/EventsSection";
import Footer from "@/components/Footer";

const Events = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16">
        <EventsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Events;