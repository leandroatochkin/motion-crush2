import { 
  useState, 
  useEffect, 
  useCallback } from 'react';

 export const useScrollNavigation = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [scrollY, setScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSectionClick = (section: string) => {
    setActiveSection(section);
    setIsMenuOpen(false);
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return {
    activeSection,
    scrollY,
    isMenuOpen,
    setIsMenuOpen,
    handleSectionClick,
  };
};

export function useMobile() {
    const [isMobile, setIsMobile] = useState(false)
  
    useEffect(() => {
      const checkIfMobile = () => {
        setIsMobile(window.innerWidth < 768)
      }
  
      // Check on initial load
      checkIfMobile()
  
      // Add event listener for window resize
      window.addEventListener("resize", checkIfMobile)
  
      // Clean up event listener
      return () => window.removeEventListener("resize", checkIfMobile)
    }, [])
  
    return isMobile
  }

type AsyncFunction<T> = (...args: any[]) => Promise<T>;

export function useAsync<T = any>(asyncFn: AsyncFunction<T>) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<T | null>(null);

  const run = useCallback(
    async (...args: any[]) => {
      setLoading(true);
      setError(null);

      try {
        const data = await asyncFn(...args);
        setResult(data);
        return { data, error: null };
      } catch (err: any) {
        const message = err?.message ?? "Unexpected error";
        setError(message);
        return { data: null, error: message };
      } finally {
        setLoading(false);
      }
    },
    [asyncFn]
  );

  return { run, loading, error, result };
}
