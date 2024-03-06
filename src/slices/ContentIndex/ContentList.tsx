"use client"

import React, { useEffect, useRef, useState } from "react";
import {asImageSrc, Content, isFilled} from "@prismicio/client"
import { MdArrowOutward } from "react-icons/md";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type ContentListProps = {
    items: Content.SocialDocument[] | Content.ProjectDocument[];
    contentType: Content.ContentIndexSlice["primary"]["content_type"];
    fallbackItemImage: Content.ContentIndexSlice["primary"]["fallback_item_image"];
    viewMoreText: Content.ContentIndexSlice["primary"]["view_more_text"];
}


export default function ContentList({
    items, 
    contentType, 
    viewMoreText="More", 
    fallbackItemImage }: ContentListProps) {

        const component = useRef(null)
        const revealRef = useRef(null)
        const itemsRef = useRef<Array<HTMLLIElement | null>>([])
        const [currentItem, setCurrentItem] = useState<null | number>(null)

        const lastMousePos = useRef({x: 0, y: 0});

        const urlPrefix = contentType === "Project" ? "/projects" : "/socials";

        useEffect(() => {
            let ctx = gsap.context(() => {
                itemsRef.current.forEach((item) => {
                    gsap.fromTo(item, 
                        {
                            opacity: 0, 
                            y: 20
                        },
                        {
                            opacity: 1, 
                            y: 0, 
                            duration: 1.3, 
                            ease: "elastic.out(1,0.3)", 
                            scrollTrigger: {
                                trigger: item,
                                start: "top bottom-=100px",
                                end: "bottom center",
                                toggleActions: "play none none none"
                            },
                        }
                    );
                });
                return () => ctx.revert(); // cleanup
            }, component);
        }, []);


        useEffect(() => {
            const handleMouseMove = (e : MouseEvent) => {
                const mousePos = {x: e.clientX, y: e.clientY + window.scrollY};

                // calc speed & direction
                const speed = Math.sqrt(Math.pow(mousePos.x - lastMousePos.current.x, 2))

                let ctx = gsap.context(() => {
                    if (currentItem !== null) {
                        const maxY = window.scrollY + window.innerHeight - 250;
                        const maxX = window.innerWidth - 350;

                        gsap.to(revealRef.current, {
                            x: gsap.utils.clamp(0, maxX, mousePos.x - 160),
                            y: gsap.utils.clamp(0, maxY, mousePos.y - 110),
                            rotation: speed * (mousePos.x > lastMousePos.current.x ? 1 : -1),
                            ease: "back.out(2)",
                            duration: 1.3

                        });
                    }
                    lastMousePos.current = mousePos;
                    return () => ctx.revert() // cleanup
                }, component);
            };

            window.addEventListener("mousemove", handleMouseMove)

            return () => {
                window.removeEventListener("mousemove", handleMouseMove);
            };

        }, [currentItem]);

        const contentImages = items.map((item) => {
            const image = isFilled.image(item.data.hover_image) ? item.data.hover_image : fallbackItemImage;

            return asImageSrc(image, {
                fit: "crop",
                w: 320,
                h: 220,
                exp: -10,
            }); 
        });

        useEffect(() => {
            contentImages.forEach((url) => {
                if (!url) return;
                const img = new Image();
                img.src = url;
            });
        }, [contentImages]);

        const onMouseEnter = (index: number) => {
            setCurrentItem(index);
            gsap.to(revealRef.current, { opacity: 1, duration: 0.5 });
        };

        const onMouseLeave = () => {
            gsap.to(revealRef.current, { 
                opacity: 0, 
                duration: 0.5,
                onComplete: () => setCurrentItem(null), // Set currentItem to null after the animation completes
            });
        }

    return (
        <div ref={component}>
            <ul className="grid border-b border-b-white" onMouseLeave={onMouseLeave}>

                {items.map((item, index) => (
                    <React.Fragment key={index}>
                        {isFilled.keyText(item.data.title) &&(
                            <li className="list-item opacity-0" onMouseEnter={() => {onMouseEnter(index)}} ref = {(el) => (itemsRef.current[index] = el)}>
                                <Link href={urlPrefix + "/" + item.uid} className="flex flex-col justify-between border-t border-t-white py-10 text-white md:flex-row"
                                    aria-label={item.data.title || ""}
                                >
                                    <div className="flex flex-col">
                                        <span className="text-3xl font-bold">
                                            {item.data.title}
                                        </span>
                                        <div className="flex gap-3 text-yellow-300 text-lg font-bold">
                                            {item.tags.map((tag, tagIndex) => (
                                                <span key={tagIndex}>{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <span className="ml-auto flex items-center gap-2 text-xl font-medium md:ml-0">
                                        {viewMoreText} <MdArrowOutward />
                                    </span>
                                </Link>
                            </li>
                        )}
                    </React.Fragment>
                ))}

            </ul>

            {/*  Hover Stuff  */}            
            <div className="hover-reveal pointer-events-none absolute left-0 top-0 -z-10 h-[220px] w-[320px] rounded-lg bg-cover
            bg-center opacity-0f transition-[background] duration-300" 
            style={{
                backgroundImage: currentItem !== null ? `url(${contentImages[currentItem]})`: "",
                opacity: 0,
            }}
            ref={revealRef}
            >

            </div>


        </div>
    )
}
