import Navigation from "@/components/Navigation";
import JoinSection from "@/components/JoinSection";
import Footer from "@/components/Footer";

const Join = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16">
        <JoinSection />
      </main>
      <Footer />
    </div>
  );
};

export default Join;