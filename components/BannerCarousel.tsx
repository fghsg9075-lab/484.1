import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
    id: string;
    image: string;
    title?: string;
    subtitle?: string;
    link?: string;
}

interface Props {
    children?: React.ReactNode[];
    slides?: Slide[];
    autoPlay?: boolean;
    interval?: number;
    className?: string;
    showDots?: boolean;
    showArrows?: boolean;
}

export const BannerCarousel: React.FC<Props> = ({
    children,
    slides,
    autoPlay = false,
    interval = 5000,
    className,
    showDots = true,
    showArrows = true
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const items = slides && slides.length > 0 ? slides : (children || []);
    const count = items.length;

    const nextSlide = () => {
        if (count > 0) setCurrentIndex((prev) => (prev + 1) % count);
    };

    const prevSlide = () => {
        if (count > 0) setCurrentIndex((prev) => (prev - 1 + count) % count);
    };

    React.useEffect(() => {
        if (!autoPlay || count <= 1) return;
        const timer = setInterval(nextSlide, interval);
        return () => clearInterval(timer);
    }, [autoPlay, interval, count]);

    if (count === 0) return null;

    return (
        <div className={`relative overflow-hidden rounded-2xl h-full ${className}`}>
            <div 
                className="flex transition-transform duration-500 ease-in-out h-full"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {slides && slides.length > 0 ? (
                    slides.map((slide, index) => (
                        <div key={slide.id || index} className="w-full flex-shrink-0 relative h-full">
                            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                            {(slide.title || slide.subtitle) && (
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                                    {slide.title && <h3 className="font-bold text-lg">{slide.title}</h3>}
                                    {slide.subtitle && <p className="text-xs opacity-80">{slide.subtitle}</p>}
                                </div>
                            )}
                            {slide.link && (
                                <a href={slide.link} className="absolute inset-0 z-10" />
                            )}
                        </div>
                    ))
                ) : (
                    (children as React.ReactNode[]).map((child, index) => (
                        <div key={index} className="w-full flex-shrink-0 h-full">
                            {child}
                        </div>
                    ))
                )}
            </div>

            {/* Arrows */}
            {showArrows && count > 1 && (
                <>
                    <button onClick={prevSlide} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-1 rounded-full hover:bg-black/50 z-20">
                        <ChevronLeft size={20} />
                    </button>
                    <button onClick={nextSlide} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-1 rounded-full hover:bg-black/50 z-20">
                        <ChevronRight size={20} />
                    </button>
                </>
            )}

            {/* Dots */}
            {showDots && count > 1 && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {items.map((_, i) => (
                        <div 
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentIndex ? 'bg-white w-3' : 'bg-white/50'}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
