import Navbar from "../../components/landing/Navbar";
import Hero from "../../components/landing/Hero";
import Universities from "../../components/landing/Universities";
import Features from "../../components/landing/Features";
import About from "../../components/landing/About";
import Testimonials from "../../components/landing/Testimonials";
import CTA from "../../components/landing/CTA";
import Footer from "../../components/landing/Footer";

const Landing = () => {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <Hero />
      <Universities />
      <Features />
      <About />
      <Testimonials />
      <CTA />
      <Footer/>
    </div>
  );
};

export default Landing;