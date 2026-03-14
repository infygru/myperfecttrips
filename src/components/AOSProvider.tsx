"use client";

import { useEffect } from "react";

export default function AOSProvider() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = parseInt(el.dataset.aosDelay || "0", 10);
            setTimeout(() => {
              el.classList.add("aos-animate");
            }, delay);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.06, rootMargin: "0px 0px -48px 0px" }
    );

    const scan = () => {
      document.querySelectorAll<HTMLElement>("[data-aos]").forEach((el) => {
        if (!el.classList.contains("aos-animate")) {
          observer.observe(el);
        }
      });
    };

    scan();

    // Re-scan after route changes
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
