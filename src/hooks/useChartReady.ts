import { useState, useRef, useEffect } from "react";

/**
 * A hook to determine if a chart's container is ready for rendering.
 * It waits until the container element has a non-zero width and height.
 * 
 * This hook prevents chart rendering race conditions, especially during
 * navigations and animations, which can cause "NaN" dimension errors.
 * 
 * @returns A tuple containing the ref to attach to the container element
 *          and a boolean `isReady` flag.
 */
export const useChartReady = <T extends HTMLElement>(): [React.RefObject<T>, boolean] => {
  const containerRef = useRef<T>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // If we're already ready, no need to do anything.
    if (isReady) return;

    const container = containerRef.current;
    if (!container) return;

    // Use a timeout to give the layout a chance to stabilize, especially
    // during route transitions or with libraries like Framer Motion.
    const timeoutId = setTimeout(() => {
        // Initial check in case the element is already sized
        if (container.offsetWidth > 0 && container.offsetHeight > 0) {
            setIsReady(true);
            return;
        }

        // If not, fall back to a ResizeObserver
        const observer = new ResizeObserver(entries => {
            for (const entry of entries) {
                if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
                    setIsReady(true);
                    observer.disconnect(); // We're done, clean up
                    break;
                }
            }
        });
        
        observer.observe(container);
        
        // Cleanup function for the effect
        return () => {
            observer.disconnect();
        };
    }, 50); // A small delay can be very effective for layout timing issues.

    return () => clearTimeout(timeoutId);

  }, [isReady]);

  return [containerRef, isReady];
}; 