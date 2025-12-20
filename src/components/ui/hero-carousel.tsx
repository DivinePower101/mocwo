import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CarouselSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  gradient?: string; // 👈 per-slide override
}

interface HeroCarouselProps {
  slides: CarouselSlide[];
  autoPlay?: boolean;
  interval?: number;
}

const HeroCarousel = ({ slides, autoPlay = true, interval = 5000 }: HeroCarouselProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  const goToSlide = (index: number) => setCurrentSlide(index);

  if (slides.length === 0) return null;

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Slides */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Background Image/Video */}
            {typeof slide.image === "string" && slide.image.endsWith(".mp4") ? (
              <video
                className="absolute inset-0 w-full h-full object-cover max-w-full"
                src={slide.image}
                autoPlay
                loop
                muted
                playsInline
              />
            ) : (
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${slide.image})` }}
              />
            )}

            {/* Dark overlay for readability */}
            <div className="absolute inset-0 bg-black/40" />

            {/* 🍷 Wine Gradient overlay (per-slide if defined, otherwise fallback wine gradient) */}
            <div
              className={`absolute inset-0 bg-gradient-to-r ${
                slide.gradient || "from-rose-900 via-purple-900 to-fuchsia-700"
              } opacity-70`}
            />

            {/* Slide Content */}
            <div className="relative z-10 flex items-center justify-center h-full">
              <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center text-white">
                  <h2 className="text-sm font-medium uppercase tracking-wider mb-4 animate-slide-up opacity-80">
                    {slide.subtitle}
                  </h2>
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-slide-up">
                    {slide.title}
                  </h1>
                  <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90 animate-slide-up">
                    {slide.description}
                  </p>
                  <div className="animate-slide-up">
                    <Button
                      size="lg"
                      onClick={() => navigate(slide.ctaLink)}
                      className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8 py-6 text-lg font-semibold shadow-divine transition-all duration-300 hover:scale-105"
                    >
                      {slide.ctaText}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-background/20 hover:bg-background/30 text-white transition-all duration-300 backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-background/20 hover:bg-background/30 text-white transition-all duration-300 backdrop-blur-sm"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-secondary scale-125"
                : "bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
