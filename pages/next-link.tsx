import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { pagesHref } from "./next-navigation";

type PagesLinkProps = Omit<ComponentPropsWithoutRef<"a">, "href"> & {
  href: string;
  replace?: boolean;
  scroll?: boolean;
  prefetch?: boolean;
};

const PagesLink = forwardRef<HTMLAnchorElement, PagesLinkProps>(function PagesLink(
  { href, replace: _replace, scroll: _scroll, prefetch: _prefetch, ...props },
  ref,
) {
  return <a ref={ref} href={pagesHref(href)} {...props} />;
});

export default PagesLink;
