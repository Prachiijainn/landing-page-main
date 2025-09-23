import Navigation from "@/components/Navigation";
import StoriesSection from "@/components/StoriesSection";
import Footer from "@/components/Footer";

const Stories = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16">
        <StoriesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Stories;