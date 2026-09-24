import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="pixel-card p-10 text-center max-w-sm">
        <div className="text-primary text-6xl mb-4" style={{ fontFamily: "'Press Start 2P', monospace" }}>
          404
        </div>
        <h1 className="text-foreground mb-4" style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '0.65rem' }}>
          PAGE NOT FOUND
        </h1>
        <p className="text-muted-foreground mb-6" style={{ fontFamily: "'VT323', monospace", fontSize: '1.1rem' }}>
          This circuit has no output. The page you're looking for doesn't exist.
        </p>
        <Link to="/" className="pixel-btn-primary px-6 py-3 inline-block">
          ← GO HOME
        </Link>
      </div>
    </div>
  );
}
