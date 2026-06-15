import HeroSection from '../components/home/HeroSection';
import FeaturedCategories from '../components/home/FeaturedCategories';
import WhyChooseUs from '../components/home/WhyChooseUs';
import FeaturedProducts from '../components/home/FeaturedProducts';
import TestimonialsSection from '../components/home/TestimonialsSection';
import BulkOrderCTA from '../components/home/BulkOrderCTA';

const Home = () => {
  return (
    <>
      <HeroSection />
      <FeaturedCategories />
      <WhyChooseUs />
      <FeaturedProducts />
      <TestimonialsSection />
      <BulkOrderCTA />
    </>
  );
};

export default Home;
