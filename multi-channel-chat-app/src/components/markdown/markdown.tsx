/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react/no-children-prop */
/* eslint-disable @typescript-eslint/no-explicit-any */
import "./code-highlight-block.css";

import { useMemo } from "react";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";

import Link from "@mui/material/Link";

import { Image } from "../image";
import { StyledRoot } from "./styles";
import { markdownClasses } from "./classes";
import { htmlToMarkdown, isMarkdownContent } from "./html-to-markdown";
import { RouterLink } from "@/routes/components";
import { isExternalLink } from "@/routes/utils";

// ----------------------------------------------------------------------

export function Markdown({ children, sx, ...other }: any) {
  const content = useMemo(() => {
    if (isMarkdownContent(`${children}`)) {
      return children;
    }
    return htmlToMarkdown(`${children}`.trim());
  }, [children]);

  return (
    <StyledRoot
      children={content}
      components={components}
      rehypePlugins={rehypePlugins}
      /* base64-encoded images
       * https://github.com/remarkjs/react-markdown/issues/774
       * urlTransform={(value: string) => value}
       */
      className={markdownClasses.root}
      sx={sx}
      {...other}
    />
  );
}

const rehypePlugins = [
  rehypeRaw,
  rehypeHighlight,
  [remarkGfm, { singleTilde: false }],
];

const components = {
  img: ({ ...other }) => (
    <Image
      ratio="16/9"
      className={markdownClasses.content.image}
      sx={{ borderRadius: 2 }}
      {...other}
    />
  ),
  a: ({ href, children, ...other }: any) => {
    const linkProps = isExternalLink(href)
      ? { target: "_blank", rel: "noopener" }
      : { component: RouterLink };

    return (
      <Link
        {...linkProps}
        href={href}
        className={markdownClasses.content.link}
        {...other}
      >
        {children}
      </Link>
    );
  },
  pre: ({ children }: any) => (
    <div className={markdownClasses.content.codeBlock}>
      <pre>{children}</pre>
    </div>
  ),
  code({ className, children, ...other }: any) {
    const language = /language-(\w+)/.exec(className || "");

    return language ? (
      <code {...other} className={className}>
        {children}
      </code>
    ) : (
      <code {...other} className={markdownClasses.content.codeInline}>
        {children}
      </code>
    );
  },
};
