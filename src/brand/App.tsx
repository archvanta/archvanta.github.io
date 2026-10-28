import { Header } from "./components/Header";
import { Hero } from "./sections/Hero";
import { Perspective } from "./sections/Perspective";
import { Expertise } from "./sections/Expertise";
import { Work } from "./sections/Work";
import { Systems } from "./sections/Systems";
import { Lab } from "./sections/Lab";
import { About } from "./sections/About";
import { Contact, Footer } from "./sections/Contact";
import { useReveal } from "./lib/useReveal";
export default function App() {
  useReveal();
  return (
    <>
      <Header />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Perspective />
        <Expertise />
        <Work />
        <Systems />
        <Lab />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
