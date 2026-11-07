import SmoothScroll from '@/components/SmoothScroll';
import Animations from '@/components/Animations';
import StoryBackground from '@/components/StoryBackground';
import { Cursor, Preloader } from '@/components/Chrome';
import { Nav } from '@/components/kit';
import Stage from '@/three/Stage';
import { Hero, Work } from '@/components/home/Story';
import { ScreensWall } from '@/components/home/ScreensWall';
import { Contact, Footer, Gallery, Marquee, Process, Services, Team } from '@/components/home/Chapters';

/**
 * "From Idea to Launch" — the page is one story. The living background
 * (StoryBackground) changes world per chapter; the 3D laptop (Stage)
 * carries the Idea → Build chapters.
 */
export default function Home() {
  return (
    <>
      <Preloader />
      <SmoothScroll />
      <StoryBackground />
      <Stage />
      <Cursor />
      <Nav />
      <main className="relative z-10">
        <Hero />
        <Work />
        <Marquee />
        <Gallery />
        <ScreensWall />
        <Services />
        <Process />
        <Team />
        <Contact />
        <Footer />
      </main>
      <Animations />
    </>
  );
}
