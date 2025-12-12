import Carusel from "../components/UI/Carousel";
import Layout from "../components/UI/Layout";
import { carouselImages } from "../data/carouselData";

export default function Home() {
  return (
    <Layout>
      <Carusel images={carouselImages} />
    </Layout>
  );
}
