import React, { useState, useEffect } from 'react';

const NotFoundPage: React.FC = () => {
  const [stars, setStars] = useState<Array<{ id: number; x: number; y: number; size: number; opacity: number; delay: number }>>([]);

  useEffect(() => {
    // Generate random stars for the background
    const newStars = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3,
      opacity: Math.random(),
      delay: Math.random() * 5
    }));
    setStars(newStars);
  }, []);

  return (
    <div style={{
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#0f0c29',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      padding: '2rem',
      overflow: 'hidden',
      width: '100vw'
    }}>
      {/* Animated stars background */}
      {stars.map(star => (
        <div
          key={star.id}
          style={{
            position: 'absolute',
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: 'white',
            borderRadius: '50%',
            opacity: star.opacity,
            animation: `twinkle ${star.delay + 3}s infinite ease-in-out`,
          }}
        />
      ))}

      {/* Main content */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: '600px'
      }}>
        <h1 style={{
          fontSize: '8rem',
          margin: '0',
          background: 'linear-gradient(45deg, #ff6b6b, #feca57, #1dd1a1, #54a0ff)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          animation: 'gradientShift 8s ease infinite',
          backgroundSize: '300% 300%'
        }}>404</h1>
        
        <h2 style={{
          fontSize: '2rem',
          margin: '1rem 0',
          color: '#f8f9fa'
        }}>Oops! Page Not Found</h2>
        
        <p style={{
          fontSize: '1.2rem',
          marginBottom: '2rem',
          color: '#dee2e6'
        }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <button
          onClick={() => window.history.back()}
          style={{
            padding: '12px 24px',
            fontSize: '1rem',
            fontWeight: 'bold',
            color: 'white',
            backgroundColor: 'transparent',
            border: '2px solid #54a0ff',
            borderRadius: '50px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            outline: 'none',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            const target = e.target as HTMLButtonElement;
            target.style.backgroundColor = '#54a0ff';
            target.style.boxShadow = '0 0 15px #54a0ff';
          }}
          onMouseLeave={(e) => {
            const target = e.target as HTMLButtonElement;
            target.style.backgroundColor = 'transparent';
            target.style.boxShadow = 'none';
          }}
        >
          Go Back
        </button>
      </div>

      {/* Inline styles for animations */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: ${Math.random()}; transform: scale(1); }
          50% { opacity: ${Math.random()}; transform: scale(1.5); }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};

export default NotFoundPage;