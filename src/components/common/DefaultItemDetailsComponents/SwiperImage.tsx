// Import Swiper React components
import Image from "@/lib/Image";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/swiper-bundle.css";
// import 'swiper/css';
import { useTranslations } from "@/lib/i18n";
const API_IMG_URL = import.meta.env.VITE_API_IMG_URL as string;
function SwiperImage({ images }: { images: { url: string; key: string }[] }) {
  const t = useTranslations();
  return (
    <Swiper
      spaceBetween={50}
      slidesPerView={1}
      style={{ width: "100%", cursor: "grab" }}
      modules={[Navigation]}
      navigation
    >
      {images.map((image, index) => (
        <SwiperSlide key={index}>
          <div
            style={{
              position: "relative",
              width: "100%",
              paddingBottom: "56.25%",
              height: "0" // Ensures the container takes up the full height of the slide
            }}
          >
            <h1 style={{ fontWeight: "700" }}> {t(image?.key)}</h1>
            <Image
              src={`${API_IMG_URL}${image?.url}` || ""}
              alt="Slide 1"
              layout="fill"
              objectFit="contain"
              style={{ borderRadius: "20px" }}
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default SwiperImage;
