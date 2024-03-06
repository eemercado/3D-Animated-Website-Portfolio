import { SliceZone } from "@prismicio/react";

import { components } from "@/slices";
import Bounded from "@/components/Bounded";
import Heading from "@/components/Heading";
import { Content, DateField, isFilled } from "@prismicio/client";

export default function ContentBody({page}: {
    page: Content.ProjectDocument | Content.SocialDocument
}) {


    function formatDate(date: DateField){ 
        if(isFilled.date(date)){
            const dateOptions: Intl.DateTimeFormatOptions = {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            };

            return new Intl.DateTimeFormat("en-AU", dateOptions).format(new Date(date));
        }
    }

    const formattedDate = formatDate(page.data.date);

  return (
  <Bounded as="article">
    <div className="rounded-2xl border-2 border-[#1B0844] bg-[#F40961] px-4 py-10 md:px-8 md:py-20">
        <Heading as="h1">{page.data.title}</Heading>
        <div className="flex gap-4 text-yellow-300 text-xl font-bold">
            {page.tags.map((tag) => (
                <span key={tag}>{tag}</span>
            ))}
        </div>
        <p className="mt-8 border-b border-[#1B0844] text-xl font-medium text-white">
            {formattedDate}
        </p>
        <div className="prose prose-lg prose-invert mt-11 w-full max-w-none md:mt-16 text-white">
            <SliceZone slices={page.data.slices} components={components} />
        </div>
        
    </div>
  </Bounded>
  );
}


