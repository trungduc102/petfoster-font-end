/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useEffect, useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import style from './styles/banner.module.css';
import { MainButton } from '..';
export interface IBannerProps {}

export default function Banner(props: IBannerProps) {
    const slider = useRef<Slider | null>(null);

    const settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        cssEase: 'linear',
    };

    useEffect(() => {
        const idInterval = setInterval(() => {
            slider.current?.slickNext();
        }, 20000);

        return () => {
            clearInterval(idInterval);
        };
    }, []);

    return (
        <div className={`w-full max-h-[166px] md:max-h-[220px] lg:max-h-[540px] relative overflow-hidden select-none ${style['box-btn']}`}>
            <Slider ref={slider} {...settings}>
                <img className="object-cover h-full" src="/images/1.svg" alt="slide" />
                <img className="object-cover h-full" src="/images/2.svg" alt="slide" />
                <div className="w-full h-full relative">
                    <img className="object-cover w-full h-full" src="/images/4.svg" alt="slide" />

                    <div className="absolute top-[30%] right-[50%] text-black-main lg:block hidden">
                        <h3 className="text-[32px] drop-shadow-md font-bold w-[500px] [text-shadow:_1px_1px_0px_rgb(255_255_255)]">
                            SAVE OFF <span className="text-[#FF7A00]">10 - 15%</span> ON ALL PRODUCTS
                        </h3>
                        <p className="text-lg [text-shadow:_1px_1px_0px_rgb(255_255_255)]">Pet food and products are from the best manufacturers.</p>
                        <MainButton background="bg-[#FF7A00]" className="mt-[25px]" title="Shop now" />
                    </div>
                </div>
            </Slider>

            <div
                className={`${style['box-btn-items']} absolute px-10 lg:px-12 w-full m-auto top-[50%] left-0 right-0 text-green-86EFAC text-sm  items-center justify-between hidden`}
            >
                <motion.div
                    whileHover={{ x: -10 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => slider?.current?.slickPrev()}
                    className="w-6 h-6  md:w-slide-btn md:h-slide-btn bg-[rgba(255,255,255,0.4)] top-[50%] 
                 flex items-center rounded-full justify-center cursor-pointer"
                >
                    <FontAwesomeIcon icon={faChevronLeft} />
                </motion.div>
                <motion.div
                    whileHover={{ x: 10 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => slider?.current?.slickNext()}
                    className="w-6 h-6  md:w-slide-btn md:h-slide-btn bg-[rgba(255,255,255,0.4)] top-[50%] 
                 flex items-center rounded-full justify-center cursor-pointer"
                >
                    <FontAwesomeIcon icon={faChevronRight} />
                </motion.div>
            </div>
        </div>
    );
}
