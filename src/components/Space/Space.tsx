import type React from 'react';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Space: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1);
    container.appendChild(renderer.domElement);

    const starTexture = new THREE.TextureLoader().load('/star.png');

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount; i++) {
      const x = (Math.random() - 0.5) * 10;
      const y = (Math.random() - 0.5) * 10;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

      // Static blue glow toward the centre. (The original recomputed this every
      // frame against a mouse position that was never wired up, so it never
      // changed — compute it once instead.)
      const intensity = Math.max(0, 1 - Math.sqrt(x ** 2 + y ** 2) / 2);
      colors[i * 3] = 0.7 + intensity * 0.3;
      colors[i * 3 + 1] = 0.7 + intensity * 0.3;
      colors[i * 3 + 2] = 1;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      map: starTexture,
      opacity: 0.8,
      size: 0.02,
      transparent: true,
      vertexColors: true
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    camera.position.z = 5;

    // Animation — just a slow drift of the whole star field.
    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      particles.rotation.x += 0.001;
      particles.rotation.y += 0.001;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', handleResize);
      container.removeChild(renderer.domElement);
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      starTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      aria-hidden='true'
      className='fixed top-0 left-0 -z-10 h-full w-full'
      ref={containerRef}
    />
  );
};
