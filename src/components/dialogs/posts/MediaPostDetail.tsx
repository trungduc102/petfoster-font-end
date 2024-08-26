'use client';
import { IBaseResponse, IComment, IImagePost } from '@/configs/interface';
import { secondsToMinute } from '@/utils/format';
import { faChevronCircleLeft, faChevronCircleRight, faPause, faPlay, faVolumeLow, faVolumeMute } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tippy from '@tippyjs/react';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import React, { MouseEvent, RefObject, useEffect, useRef, useState } from 'react';

const variants = {
    initial: (direction: number) => {
        return {
            x: direction > 0 ? 100 : -100,
            opacity: 0,
        };
    },
    animate: {
        x: 0,
        opacity: 1,

        transition: {
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
        },
    },
    exit: (direction: number) => {
        return {
            x: direction > 0 ? -100 : 100,
            opacity: 0,

            transition: {
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
            },
        };
    },
};

export interface IMediaPostDetailProps {
    images: IImagePost[];
}

export default function MediaPostDetail({ images }: IMediaPostDetailProps) {
    const [curImage, setCurImage] = useState(0);
    const [direction, setDirection] = useState(0);

    // video refs
    const ref = useRef<HTMLVideoElement>(null);
    const refInput = useRef<HTMLInputElement>(null);
    const refTimeLine = useRef<HTMLInputElement>(null);
    const refProgress: RefObject<HTMLDivElement> = useRef(null);

    // video state
    const [hover, setHover] = useState(true);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMute, setIsMute] = useState(true);
    const [persent, setPersent] = useState(0);

    const [progress, setProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    function nextStep() {
        setDirection(1);
        if (curImage === images.length - 1) {
            setCurImage(0);
            return;
        }
        setCurImage(curImage + 1);
    }

    function prevStep() {
        setDirection(-1);
        if (curImage === 0) {
            setCurImage(images.length - 1);
            return;
        }
        setCurImage(curImage - 1);
    }

    //video funtional
    const handlePlay = (e: MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        if (!ref.current) return;
        setIsPlaying((prev) => !prev);
        if (isPlaying) {
            ref.current.pause();
        } else {
            ref.current.play();
        }
    };

    const handleLeave = () => {
        setHover(false);
    };

    const handleOver = () => {
        setHover(true);
    };

    const handleEnded = () => {
        if (!ref.current) return;
        ref.current.play();
    };

    const handleMute = () => {
        setIsMute((prev) => !prev);
        if (!ref.current) return;

        ref.current.muted = isMute;
    };

    const handlePlaying = () => {
        if (!ref.current) return;
        const { duration, currentTime } = ref.current;
        let timeUpdate = ((currentTime * 100) / duration).toFixed(0);
        setPersent(Number(timeUpdate));
    };

    const setVolumn = (percent: number) => {
        const video = ref.current;

        if (video) video.volume = percent / 100;
    };

    const setProgressAndVolumn = () => {
        if (!refInput) return;

        const max = parseInt(refInput.current?.getAttribute('max') || '100');
        const min = parseInt(refInput.current?.getAttribute('min') || '0');
        const value = parseInt(refInput.current?.value || '0');

        let percent = ((value - min) / (max - min)) * 100;

        setProgress(percent);
        setVolumn(progress);
    };

    const handleMoveTime = () => {
        if (!refTimeLine) return;
        const second = (parseInt(refTimeLine.current?.value as string) / 100) * (ref.current?.duration || 0);
        ref.current!.currentTime = second;
        setPersent(second);
    };

    useEffect(() => {
        if (!ref.current) return;
        ref.current.muted = isMute;
    }, [isMute]);
    return (
        <>
            <AnimatePresence initial={false} custom={direction}>
                <div onMouseEnter={handleOver} onMouseLeave={handleLeave} className="sm:hidden md:block flex-1 h-full overflow-hidden relative">
                    {images.length && !images[curImage]?.isVideo && (
                        <motion.img
                            variants={variants}
                            animate="animate"
                            initial="initial"
                            exit="exit"
                            src={images[curImage]?.url}
                            alt={images[curImage]?.url}
                            className="w-full max-w-full h-full object-cover"
                            key={images[curImage]?.url}
                            custom={direction}
                            loading="lazy"
                        />
                    )}

                    {images.length && images[curImage]?.isVideo && (
                        <video
                            onLoadedData={() => {
                                setIsLoading(false);
                            }}
                            onTimeUpdate={handlePlaying}
                            onEnded={handleEnded}
                            ref={ref}
                            autoPlay
                            className="absolute w-full h-full object-cover "
                            src={images[curImage]?.url}
                        />
                    )}

                    {!images[curImage]?.isVideo && (
                        <>
                            {images.length > 1 && (
                                <div className="absolute inset-0 flex items-center justify-center z-30">
                                    <div className="w-full flex items-center justify-between px-6">
                                        <span className="text-2xl text-white cursor-pointer" onClick={prevStep}>
                                            <FontAwesomeIcon icon={faChevronCircleLeft} />
                                        </span>
                                        <span className="text-2xl text-white cursor-pointer" onClick={nextStep}>
                                            <FontAwesomeIcon icon={faChevronCircleRight} />
                                        </span>
                                    </div>
                                </div>
                            )}

                            {images.length > 1 && (
                                <div className="absolute flex items-end justify-center gap-[6px] w-full h-full inset-0 pb-4">
                                    {images.map((item, index) => {
                                        return (
                                            <span
                                                key={index}
                                                className={classNames('w-2 h-2  rounded-full', {
                                                    ['bg-gray-300']: index !== curImage,
                                                    ['bg-white']: index === curImage,
                                                })}
                                            ></span>
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    )}

                    {images[curImage]?.isVideo && (
                        <>
                            <span
                                onClick={handlePlay}
                                className={`${hover ? 'opacity-100' : 'opacity-0'} text-xl h-10 w-10 flex items-center 
                        justify-center left-3 absolute text-white bottom-[26px] transition duration-100 ease-in`}
                            >
                                <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
                            </span>
                            <Tippy
                                interactive
                                offset={[0, 14]}
                                render={(attrs) => (
                                    <div {...attrs} className="text-white">
                                        <div className="bg-[rgba(22,24,35,.34)] rotate-[-90deg] w-16 h-6 rounded-[32px] relative flex flex-col overflow-hidden px-2">
                                            <div className="w-full h-full flex items-center relative">
                                                <input
                                                    onInput={setProgressAndVolumn}
                                                    onClick={setProgressAndVolumn}
                                                    ref={refInput}
                                                    className="input-range w-full h-[2px] bg-[rgba(255,255,255,0.34)] rounded z-10"
                                                    type="range"
                                                    max={100}
                                                    min={0}
                                                />
                                                <div ref={refProgress} style={{ width: progress + '%' }} className="w-[50%] h-[2px] absolute bg-white rounded"></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            >
                                <span
                                    onClick={handleMute}
                                    className={`${hover ? 'opacity-100' : !isMute ? 'opacity-100' : 'opacity-0'} text-xl h-10 w-10 flex items-center 
                            justify-center right-3 absolute text-white bottom-[26px] transition duration-100 ease-in`}
                                >
                                    <FontAwesomeIcon icon={isMute ? faVolumeMute : faVolumeLow} />
                                </span>
                            </Tippy>
                            <div
                                className={`${
                                    hover ? 'opacity-100' : 'opacity-0'
                                } h-[16px] w-full absolute mx-3 bottom-2 transition duration-100 ease-in flex items-center justify-between overflow-hidden`}
                            >
                                <div className="flex-1 h-full flex items-center relative">
                                    <div className="w-full h-full flex items-center relative">
                                        <input
                                            ref={refTimeLine}
                                            onInput={handleMoveTime}
                                            onClick={handleMoveTime}
                                            className="input-range input-video w-full h-[2px] bg-[rgba(255,255,255,0.34)] rounded z-10"
                                            type="range"
                                            max={100}
                                            min={0}
                                            onChange={(e) => {
                                                setPersent(parseInt(e.target.value));
                                            }}
                                            value={persent}
                                        />
                                        <div style={{ width: persent + '%' }} className="progress h-[2px] absolute bg-white rounded"></div>
                                    </div>
                                </div>
                                <span className="text-white text-sm ml-2 h-[16px] text-[10px]  right-3 bottom-[3.2px] pr-5">
                                    {ref.current && secondsToMinute(ref.current?.currentTime)}/{ref.current && secondsToMinute(ref.current.duration)}
                                </span>
                            </div>
                        </>
                    )}
                </div>
            </AnimatePresence>
        </>
    );
}
