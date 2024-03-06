import Button from "@/components/Button";
import { Content } from "@prismicio/client";
import { PrismicNextLink } from "@prismicio/next";
import { SliceComponentProps } from "@prismicio/react";

/**
 * Props for `Link`.
 */
export type LinkProps = SliceComponentProps<Content.LinkSlice>;

/**
 * Component for "Link" Slices.
 */
 const Link = ({ slice }: LinkProps): JSX.Element => {
  return (
    <PrismicNextLink field={slice.primary.linkk} className="inline-block bg-yellow-300 text-black font-bold py-2 px-4 hover:bg-white transition duration-300 ease-in-out rounded-md border-2 border-[#1B0844]">
      {slice.primary.label}
    </PrismicNextLink>
  );
};

export default Link;
