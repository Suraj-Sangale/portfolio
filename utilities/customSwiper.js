import { useId } from "react";
import { Swiper } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectCoverflow, EffectCards } from "swiper/modules";

import commonStyle from "@/styles/common.module.scss";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function CustomSwiper({ children, carouselOptions, className = "" }) {
	const id = useId();

	const options = {
		slidesPerView: 1,
		centeredSlides: false,
		spaceBetween: 0,
		loop: false,
		rewind: false,
		pagination: false,
		observer: true,
		observeParents: true,
		observeSlideChildren: true,
		navigation: carouselOptions?.navigation
			? {
					nextEl: `.swiper-instance-${id} .swiper-button-next`,
					prevEl: `.swiper-instance-${id} .swiper-button-prev`,
			  }
			: false,
		onSlideChange: () => {},
		onSwiper: (swiper) => {
			// Force autoplay start on mobile after a short delay
			if (carouselOptions?.autoplay && swiper.autoplay) {
				setTimeout(() => {
					swiper.autoplay?.start();
				}, 100);
			}
		},
		onInit: (swiper) => {
			// Ensure autoplay starts on initialization
			if (carouselOptions?.autoplay && swiper.autoplay) {
				swiper.autoplay?.start();
			}
		},
		modules: [Navigation, Pagination, Autoplay, EffectCoverflow, EffectCards],
		...carouselOptions,
	};

	return (
		<>
			{carouselOptions === false ? (
				<>{children}</>
			) : (
				<Swiper
					className={commonStyle["swiper"] + ` swiper-instance-${id} ${className}`}
					{...options}
				>
					{children}
				</Swiper>
			)}
		</>
	);
}
