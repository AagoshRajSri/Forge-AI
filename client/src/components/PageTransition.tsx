import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";

interface PageTransitionProps {
  children: React.ReactNode;
}

/**
 * Wraps page content with a smooth GSAP fade+slide-up transition
 * that fires every time the route changes.
 */
export default function PageTransition({ children }: PageTransitionProps) {
  const el = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: "power3.out",
          clearProps: "all",
        }
      );
    }, el);

    return () => ctx.revert();
  }, [location.pathname]);

  return (
    <div ref={el} style={{ willChange: "opacity, transform" }}>
      {children}
    </div>
  );
}
