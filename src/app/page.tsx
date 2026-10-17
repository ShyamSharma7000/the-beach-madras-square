import { Footer } from "@/components/layout/Footer";
import { Header, type NavLink } from "@/components/layout/Header";
import { Enquire } from "@/components/sections/Enquire";
import { Food } from "@/components/sections/Food";
import { GallerySection } from "@/components/sections/GallerySection";
import { Hero } from "@/components/sections/Hero";
import { Location } from "@/components/sections/Location";
import { Occasions } from "@/components/sections/Occasions";
import { Reserve } from "@/components/sections/Reserve";
import { Story } from "@/components/sections/Story";
import { Intro } from "@/components/ui/Intro";
import { JsonLd } from "@/components/ui/JsonLd";
import { launched, showGallery } from "@/lib/site";

const LINKS: NavLink[] = [
  { href: "#story", label: "The place" },
  { href: "#food", label: "Food and drink" },
  ...(showGallery ? [{ href: "#gallery", label: "Gallery" }] : []),
  { href: "#occasions", label: "Occasions" },
  { href: "#visit", label: "Find us" },
];

export default function Home() {
  return (
    <>
      {launched && <JsonLd />}
      <Intro />
      <Header links={LINKS} />
      <main id="main">
        <div id="top" />
        <Hero />
        <Story />
        <Food />
        {showGallery && <GallerySection />}
        <Occasions />
        <Reserve />
        <Enquire />
        <Location />
      </main>
      <Footer />
    </>
  );
}
