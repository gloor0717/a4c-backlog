import React from "react";

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 py-3 text-center text-sm">
        Tous droits réservés © {new Date().getFullYear()}  
        <a
          href="https://all4club.ch"
          target="_blank"
          rel="noopener noreferrer"
          className="underline ml-1 hover:text-primary-dark"
        >
          All4Club
        </a>
      </div>
    </footer>
  );
}
