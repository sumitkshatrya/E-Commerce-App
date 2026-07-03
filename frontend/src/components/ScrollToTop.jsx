import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop — Scrolls to the top of the page on every route change.
 * Renders nothing; purely a side-effect component.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
