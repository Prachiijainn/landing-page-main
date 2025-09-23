import Navigation from "@/components/Navigation";
import HelpSection from "@/components/HelpSection";
import Footer from "@/components/Footer";

const Help = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16">
        <HelpSection />
      </main>
      <Footer />
    </div>
  );
};

export default Help;