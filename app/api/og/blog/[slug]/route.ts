import { NextRequest } from "next/server";
import { ImageResponse } from "next/og";
import React from "react";

export const runtime = "edge";
export const alt = "Blog Post OpenGraph Image";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function fetchPost(slug: string) {
  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NODE_ENV === "production"
      ? "https://your-domain.vercel.app"
      : "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/blogs/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  const post = await fetchPost(slug);

  const title = post?.title || "Article";
  const excerpt = post?.excerpt || "Read the full article on my blog.";
  const tags: string[] = post?.tags?.slice(0, 3) || [];

  return new ImageResponse(
    React.createElement(
      "div",
      {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          fontFamily: 'system-ui, "Segoe UI", Roboto',
          background: "linear-gradient(135deg,#1e1b4b,#4c1d95,#831843)",
          color: "white",
          padding: "64px",
          boxSizing: "border-box",
        },
      },
      [
        React.createElement(
          "div",
          {
            key: "top",
            style: { display: "flex", flexDirection: "column", gap: 32 },
          },
          [
            React.createElement(
              "div",
              {
                key: "tags",
                style: {
                  display: "flex",
                  gap: 12,
                  flexWrap: "wrap",
                  fontSize: 24,
                  fontWeight: 500,
                  opacity: 0.9,
                },
              },
              tags.map((t) =>
                React.createElement(
                  "div",
                  {
                    key: t,
                    style: {
                      padding: "6px 18px",
                      background: "rgba(255,255,255,0.12)",
                      borderRadius: 32,
                      backdropFilter: "blur(4px)",
                    },
                  },
                  `#${t}`
                )
              )
            ),
            React.createElement(
              "h1",
              {
                key: "title",
                style: {
                  fontSize: 72,
                  lineHeight: 1.1,
                  fontWeight: 700,
                  margin: 0,
                  letterSpacing: "-2px",
                  textShadow: "0 4px 16px rgba(0,0,0,0.4)",
                },
              },
              title
            ),
            React.createElement(
              "p",
              {
                key: "excerpt",
                style: {
                  fontSize: 32,
                  lineHeight: 1.3,
                  maxWidth: 1000,
                  margin: 0,
                  opacity: 0.85,
                  fontWeight: 400,
                },
              },
              excerpt.length > 180 ? `${excerpt.slice(0, 177)}…` : excerpt
            ),
          ]
        ),
        React.createElement(
          "div",
          {
            key: "bottom",
            style: {
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              fontSize: 28,
              fontWeight: 500,
              opacity: 0.85,
            },
          },
          [
            React.createElement("span", { key: "brand" }, "portfolio · blog"),
            React.createElement(
              "span",
              { key: "slug", style: { fontSize: 24 } },
              `/${slug}`
            ),
          ]
        ),
      ]
    ),
    { ...size }
  );
}
