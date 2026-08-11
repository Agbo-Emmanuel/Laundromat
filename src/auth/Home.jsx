import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Start fading out slightly before navigating so the transition feels seamless
    const exitTimer = setTimeout(() => setIsExiting(true), 2700);
    const navTimer = setTimeout(() => navigate("/login"), 3000);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(navTimer);
    };
  }, [navigate]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
        background: "#0B0D0F",
        opacity: isExiting ? 0 : 1,
        transition: "opacity 300ms ease",
      }}
    >
      <div className="logo-pulse">
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="8" y="8" width="48" height="48" rx="14" fill="#4F7CFF" />
        </svg>
      </div>

      <style>{`
        .logo-pulse {
          animation: pulse 1.4s ease-in-out infinite;
        }

        @keyframes pulse {
          0% { transform: scale(0.9); opacity: 0.6; }
          50% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(0.9); opacity: 0.6; }
        }

        @media (prefers-reduced-motion: reduce) {
          .logo-pulse { animation: none; }
        }
      `}</style>
    </div>
  );
};

export default Home;
