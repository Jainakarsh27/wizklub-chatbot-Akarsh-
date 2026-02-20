import React, { useRef } from 'react';
import Chatbot from './components/Chatbot';
import { Sparkles, Star, ShieldCheck, Users } from 'lucide-react';

const MouseTrail = () => {
  const [position, setPosition] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      className="mouse-trail"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`
      }}
    />
  );
};

function App() {
  const chatbotRef = useRef(null);

  const handleExplore = () => {
    if (chatbotRef.current) {
      chatbotRef.current.openToFlow('choice');
    }
  };

  return (
    <div className="app-main" style={{ width: '100vw', minHeight: '100vh', padding: '40px', position: 'relative' }}>
      <div className="mesh-bg"></div>
      <MouseTrail />

      <header style={{ textAlign: 'center', marginBottom: '60px', position: 'relative', zIndex: 1 }}>
        <h1 className="glow-text" style={{ fontSize: '4.5rem', fontWeight: 800, marginBottom: '16px' }}>
          <b>Akarsh</b> <span style={{ color: 'var(--primary)' }}>STEM</span> Excellence
        </h1>
        <p style={{ fontSize: '1.4rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
          Empowering the next generation of innovators with Robotics, AI, and Future Skills.
        </p>
      </header>

      <main style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', position: 'relative', zIndex: 1 }}>
        {[
          { icon: <Sparkles />, title: "AI Learning", desc: "Adaptive learning paths tailored for every student's unique pace." },
          { icon: <ShieldCheck />, title: "Certified Programs", desc: "Globally recognized certifications to build a stellar portfolio." },
          { icon: <Users />, title: "Expert Mentors", desc: "One-on-one guidance from industry veterans and STEM experts." },
        ].map((feature, i) => (
          <div key={i} className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
              {React.cloneElement(feature.icon, { size: 56, color: 'var(--primary)' })}
            </div>
            <h3 style={{ marginBottom: '16px', fontSize: '1.6rem', fontWeight: 700 }}>{feature.title}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.5 }}>{feature.desc}</p>
          </div>
        ))}
      </main>

      <div style={{ marginTop: '80px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <button
          className="btn-primary"
          style={{ fontSize: '1.2rem', padding: '20px 48px', borderRadius: '16px' }}
          onClick={handleExplore}
        >
          Explore Our Programs
        </button>
      </div>

      <Chatbot ref={chatbotRef} />
    </div>
  );
}

export default App;
