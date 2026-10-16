import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Food } from "@/components/sections/Food";
import { GallerySection } from "@/components/sections/GallerySection";
import { Hero } from "@/components/sections/Hero";
import { Location } from "@/components/sections/Location";
import { Occasions } from "@/components/sections/Occasions";
import { Reserve } from "@/components/sections/Reserve";
import { Story } from "@/components/sections/Story";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <div id="top" />
        <Hero />
        <Story />
        <Food />
        <GallerySection />
        <Occasions />
        <Reserve />
        <Location />
      </main>
      <Footer />
    </>
  );
}
