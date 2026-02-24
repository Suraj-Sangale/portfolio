import { useRouter } from "next/router";
import { useState, useRef, useCallback } from "react";

const SOCIAL_LINKS = [
  {
    id: "twitter",
    color: "#1da1f2",
    c2: "#0d7dc5",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    id: "instagram",
    color: "#e1306c",
    c2: "#f77737",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    id: "youtube",
    color: "#ff0000",
    c2: "#cc0000",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    id: "github",
    color: "#e0e0e0",
    c2: "#aaaaaa",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
  {
    id: "linkedin",
    color: "#0a66c2",
    c2: "#004182",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    id: "discord",
    color: "#5865f2",
    c2: "#3b47d1",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.044.032.056a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
      </svg>
    ),
  },
  {
    id: "tiktok",
    color: "#69c9d0",
    c2: "#ee1d52",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.89a8.19 8.19 0 0 0 4.79 1.52V7c-.01 0-1.65-.17-2.02-1.31z" />
      </svg>
    ),
  },
  {
    id: "whatsapp",
    color: "#25d366",
    c2: "#128c7e",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
      </svg>
    ),
  },
  {
    id: "telegram",
    color: "#2aabee",
    c2: "#1b7cbf",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
  {
    id: "reddit",
    color: "#ff4500",
    c2: "#cc3700",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
      </svg>
    ),
  },
  {
    id: "twitch",
    color: "#9147ff",
    c2: "#6b2fcc",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
      </svg>
    ),
  },
  {
    id: "spotify",
    color: "#1db954",
    c2: "#148a3d",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
      </svg>
    ),
  },
  {
    id: "dribbble",
    color: "#ea4c89",
    c2: "#c0316a",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.017-8.04 6.404 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4.01-.814zm-9.49-3.594c.23-.38 3.02-4.865 8.304-6.573.092-.03.186-.058.28-.082-.18-.408-.37-.816-.567-1.216-5.33 1.593-10.51 1.528-10.96 1.516l-.01.24c0 2.775.99 5.32 2.625 7.293zm-2.42-8.624c.462.013 4.913.011 9.904-1.37-.94-1.74-1.97-3.22-2.142-3.46-2.91 1.37-5.15 3.8-5.762 6.44zm7.73-7.43c.176.243 1.23 1.724 2.155 3.5 2.06-.77 2.937-1.945 3.04-2.09C15.18 2.137 13.65 1.47 12 1.47c-.63 0-1.24.084-1.82.238zm5.7 2.697c-.123.168-1.1 1.418-3.232 2.32.136.28.27.567.397.854 4.165-1.302 5.88-.003 6.087.085-.057-1.246-.52-2.38-1.253-3.26z" />
      </svg>
    ),
  },
  {
    id: "stackoverflow",
    color: "#f48024",
    c2: "#c25e00",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M18.986 21.865v-6.404h2.134V24H1.844v-8.539h2.13v6.404h15.012zM6.111 19.731H16.85v-2.137H6.111v2.137zm.259-4.852 10.48 2.189.451-2.07-10.478-2.187-.453 2.068zm1.359-5.056 9.705 4.53.903-1.95-9.706-4.53-.902 1.95zm2.715-4.785 8.217 6.855 1.359-1.62-8.216-6.853-1.36 1.618zM15.751 0l-1.746 1.294 6.405 8.604 1.746-1.294L15.751 0z" />
      </svg>
    ),
  },
  {
    id: "email",
    color: "#ea4335",
    c2: "#c5221f",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
      </svg>
    ),
  },
  {
    id: "facebook",
    color: "#1877f2",
    c2: "#0c5ecf",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.931-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
      </svg>
    ),
  },
  {
    id: "medium",
    color: "#ffffff",
    c2: "#cccccc",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
      </svg>
    ),
  },
];

const CSS = `
  @property --angle { syntax:'<angle>'; initial-value:0deg; inherits:false; }
  @keyframes popIn { from{opacity:0;transform:scale(.3) rotate(-20deg) translateY(20px)} to{opacity:1;transform:scale(1) rotate(0) translateY(0)} }
  @keyframes spinB  { to{ --angle:360deg } }
  @keyframes pulse  { 0%{opacity:.7;transform:scale(1)} 100%{opacity:0;transform:scale(1.8)} }
  @keyframes burst  { 0%{transform:translate(-50%,-50%) translate(0,0) scale(1);opacity:1} 100%{transform:translate(-50%,-50%) translate(var(--bx),var(--by)) scale(0);opacity:0} }
  @keyframes shake  { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-4px) rotate(-2deg)} 40%{transform:translateX(4px) rotate(2deg)} 60%{transform:translateX(-3px)} 80%{transform:translateX(3px)} }

  .sr-wrap { display:flex;flex-wrap:wrap;gap:1.2rem;align-items:center;justify-content:center; }
  .sr-btn {
    position:relative;width:45px;height:45px;border-radius:18px;
    display:flex;align-items:center;justify-content:center;
    cursor:pointer;border:1px solid rgba(255,255,255,.1);
    background:rgba(255,255,255,.05);backdrop-filter:blur(16px);
    transition:transform .45s cubic-bezier(.34,1.56,.64,1),box-shadow .35s,border-color .35s,background .35s;
    isolation:isolate;overflow:hidden;opacity:0;
    animation:popIn .6s cubic-bezier(.34,1.56,.64,1) forwards;
    text-decoration:none;
  }
  .sr-btn.disabled { cursor:not-allowed;filter:grayscale(1) brightness(.38);pointer-events:none; }
  .sr-btn.disabled::after { display:none!important; }
  .sr-btn::before {
    content:'';position:absolute;inset:0;
    background:linear-gradient(120deg,transparent 0%,rgba(255,255,255,.18) 40%,rgba(255,255,255,.36) 50%,rgba(255,255,255,.18) 60%,transparent 100%);
    transform:translateX(-150%) skewX(-20deg);transition:transform 0s;pointer-events:none;z-index:2;
  }
  .sr-btn:hover::before { transform:translateX(150%) skewX(-20deg);transition:transform .55s ease; }
  .sr-btn::after {
    content:'';position:absolute;inset:-2px;border-radius:20px;
    background:conic-gradient(from var(--angle,0deg),var(--c1) 0%,var(--c2) 25%,transparent 50%,var(--c1) 100%);
    opacity:0;transition:opacity .3s;z-index:-1;animation:spinB 3s linear infinite;
  }
  .sr-btn:hover::after { opacity:1; }
  .sr-btn:hover  { transform:translateY(-10px) scale(1.12);background:rgba(255,255,255,.09); }
  .sr-btn:active { transform:translateY(-3px) scale(.95); }
  .sr-btn.shaking { animation:shake .4s ease!important;opacity:1; }

  .sr-svg  { width:20px;height:20px;position:relative;z-index:3;color:rgba(255,255,255,.75);transition:transform .45s cubic-bezier(.34,1.56,.64,1),color .3s,filter .3s; }
  .sr-btn:hover .sr-svg { color:#fff;transform:scale(1.2) rotate(-8deg); }

  .sr-ring { position:absolute;inset:0;border-radius:18px;border:2px solid var(--c1,#fff);opacity:0;pointer-events:none;z-index:1; }
  .sr-btn:hover .sr-ring { animation:pulse 1.2s ease-out infinite; }

  .sr-aura { position:absolute;inset:0;border-radius:18px;opacity:0;transition:opacity .3s;pointer-events:none;z-index:0; }
  .sr-btn:hover .sr-aura { opacity:1; }

  .sr-tip {
    position:absolute;bottom:-44px;left:50%;
    transform:translateX(-50%) translateY(6px) scale(.85);
    background:rgba(10,10,20,.9);backdrop-filter:blur(10px);
    border:1px solid rgba(255,255,255,.12);color:#fff;
    font:700 .58rem/1 'Segoe UI',sans-serif;letter-spacing:.1em;text-transform:uppercase;
    padding:5px 11px;border-radius:7px;white-space:nowrap;pointer-events:none;
    opacity:0;transition:opacity .2s,transform .35s cubic-bezier(.34,1.56,.64,1);z-index:10;
  }
  .sr-btn:hover .sr-tip { opacity:1;transform:translateX(-50%) translateY(0) scale(1); }

  .sr-off-badge {
    position:absolute;top:4px;right:4px;width:14px;height:14px;border-radius:50%;
    background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);
    display:flex;align-items:center;justify-content:center;z-index:10;
    font-size:8px;color:rgba(255,255,255,.45);
  }
  .sr-burst { position:absolute;width:6px;height:6px;border-radius:50%;pointer-events:none;z-index:20;left:50%;top:50%;animation:burst .55s ease-out forwards; }
`;

function Icon({ item, index }) {
  const ref = useRef(null);
  const [shaking, setShaking] = useState(false);

  const onMove = useCallback(
    (e) => {
      if (item.disabled) return;
      const r = ref.current.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      ref.current.style.transform = `translateY(-10px) scale(1.12) perspective(400px) rotateX(${(y / (r.height / 2)) * -20}deg) rotateY(${(x / (r.width / 2)) * 20}deg)`;
    },
    [item.disabled],
  );

  const onLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = "";
  }, []);

  const onClick = useCallback(() => {
    if (item.disabled) {
      setShaking(true);
      setTimeout(() => setShaking(false), 420);
      return;
    }
    const el = ref.current;
    for (let i = 0; i < 10; i++) {
      const d = document.createElement("div");
      d.className = "sr-burst";
      const a = (i / 10) * Math.PI * 2,
        dist = 40 + Math.random() * 25;
      d.style.cssText = `background:${item.color};box-shadow:0 0 6px ${item.color};--bx:${Math.cos(a) * dist}px;--by:${Math.sin(a) * dist}px;animation-duration:${0.45 + Math.random() * 0.25}s`;
      el.appendChild(d);
      d.addEventListener("animationend", () => d.remove());
    }
  }, [item]);

  const hoverEnter = useCallback(
    (e) => {
      if (item.disabled) return;
      e.currentTarget.style.boxShadow = `0 8px 36px ${item.color}88,0 0 0 1px ${item.color}55`;
      e.currentTarget.style.borderColor = `${item.color}77`;
      const svg = e.currentTarget.querySelector(".sr-svg");
      if (svg) svg.style.filter = `drop-shadow(0 0 12px ${item.color}ff)`;
    },
    [item],
  );

  const hoverOut = useCallback(
    (e) => {
      e.currentTarget.style.boxShadow = "";
      e.currentTarget.style.borderColor = "";
      const svg = e.currentTarget.querySelector(".sr-svg");
      if (svg) svg.style.filter = `drop-shadow(0 0 5px ${item.color}66)`;
    },
    [item],
  );

  return (
    <a
      ref={ref}
      href={item.disabled ? undefined : item.href}
      target={item.disabled ? undefined : "_blank"}
      rel="noopener noreferrer"
      className={`sr-btn${item.disabled ? " disabled" : ""}${shaking ? " shaking" : ""}`}
      style={{
        "--c1": item.color,
        "--c2": item.c2,
        animationDelay: `${index * 0.06}s`,
      }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      onMouseEnter={hoverEnter}
      onMouseOut={hoverOut}
      aria-label={item.label}
      aria-disabled={item.disabled}
    >
      <div
        className="sr-aura"
        style={{
          background: `radial-gradient(circle,${item.color}44,transparent 70%)`,
        }}
      />
      <div className="sr-ring" />
      <span
        className="sr-svg"
        style={{ filter: `drop-shadow(0 0 5px ${item.color}66)` }}
      >
        {item.icon}
      </span>
      <span className="sr-tip">{item.label}</span>
      {item.disabled && <span className="sr-off-badge">✕</span>}
    </a>
  );
}

function SocialRow({
  links = SOCIAL_LINKS,
  showDisabled = true,
  socialLinks = [],
}) {
  const finalArr = socialLinks.map((link) => {
    const found = links.find((l) => l.id === link.id);
    return found ? { ...link, ...found } : link;
  });
  const visible = showDisabled ? finalArr : finalArr.filter((l) => !l.disabled);
  return (
    <>
      <style>{CSS}</style>
      <div className="sr-wrap">
        {visible.map((item, i) => (
          <Icon
            key={item.id}
            item={item}
            index={i}
          />
        ))}
      </div>
    </>
  );
}

export default function SocialIcons({ socialLinks }) {
  const router = useRouter();
  const [showDisabled, setShowDisabled] = useState(false);
  const [isPersonalized, setIsPersonalized] = useState(
    router.query.personal === "true",
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "2.5rem",
        // padding: "2rem",
        fontFamily: "system-ui",
      }}
    >
      {/* Toggle */}
      {isPersonalized && (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              disabled: true,
            }}
          >
            <span
              style={{
                color: "rgba(255,255,255,.4)",
                fontSize: ".75rem",
                letterSpacing: ".15em",
                textTransform: "uppercase",
              }}
            >
              Show disabled
            </span>
            <button
              onClick={() => setShowDisabled((v) => !v)}
              style={{
                width: 44,
                height: 24,
                borderRadius: 12,
                border: "none",
                cursor: "pointer",
                position: "relative",
                background: showDisabled ? "#7b61ff" : "rgba(255,255,255,.1)",
                transition: "background .3s",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: 3,
                  left: showDisabled ? 22 : 3,
                  width: 18,
                  height: 18,
                  borderRadius: 9,
                  background: "#fff",
                  transition: "left .3s",
                  display: "block",
                }}
              />
            </button>
            <span
              style={{
                color: showDisabled ? "#7b61ff" : "rgba(255,255,255,.25)",
                fontSize: ".7rem",
                fontWeight: 700,
                letterSpacing: ".1em",
                textTransform: "uppercase",
                transition: "color .3s",
              }}
            >
              {showDisabled ? "ON" : "OFF"}
            </span>
          </div>{" "}
          <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                gap: "6px",
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 2,
                  background: "rgba(255,255,255,.5)",
                }}
              />
              <span
                style={{
                  color: "rgba(255,255,255,.4)",
                  fontSize: ".65rem",
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                }}
              >
                Active
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 2,
                  background: "rgba(255,255,255,.15)",
                  border: "1px solid rgba(255,255,255,.2)",
                }}
              />
              <span
                style={{
                  color: "rgba(255,255,255,.25)",
                  fontSize: ".65rem",
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                }}
              >
                Disabled (Telegram, Spotify)
              </span>
            </div>
          </div>
        </>
      )}

      {/* The component */}
      <SocialRow
        showDisabled={showDisabled}
        socialLinks={socialLinks}
      />

      {/* Data hint
      <div
        style={{
          marginTop: "1rem",
          padding: "12px 20px",
          borderRadius: 10,
          background: "rgba(255,255,255,.04)",
          border: "1px solid rgba(255,255,255,.08)",
          color: "rgba(255,255,255,.3)",
          fontSize: ".65rem",
          fontFamily: "monospace",
          letterSpacing: ".05em",
          lineHeight: 1.7,
          maxWidth: 420,
          textAlign: "center",
        }}
      >
        {"// Data object controls rendering"}
        <br />
        {"{ id, label, href, color, c2, disabled, icon }"}
        <br />
        {"disabled: true  → greyed out + ✕ badge + shake on click"}
        <br />
        {"showDisabled prop → toggles visibility entirely"}
      </div> */}
    </div>
  );
}
