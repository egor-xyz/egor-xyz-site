import type React from 'react';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Space: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1);
    containerRef.current.appendChild(renderer.domElement);

    // Load texture
    const textureLoader = new THREE.TextureLoader();
    const starTexture = textureLoader.load('/star.png');

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);
    const rotations = new Float32Array(particlesCount);

    for (let i = 0; i < particlesCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

      colors[i * 3] = Math.random() * 0.3 + 0.7;
      colors[i * 3 + 1] = Math.random() * 0.3 + 0.7;
      colors[i * 3 + 2] = Math.random() * 0.3 + 0.7;

      rotations[i] = Math.random() * 2 * Math.PI;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particlesGeometry.setAttribute('rotation', new THREE.BufferAttribute(rotations, 1));

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

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);

      particles.rotation.x += 0.001;
      particles.rotation.y += 0.001;

      const positions = particlesGeometry.attributes.position.array as Float32Array;
      const colors = particlesGeometry.attributes.color.array as Float32Array;
      const rotations = particlesGeometry.attributes.rotation.array as Float32Array;

      for (let i = 0; i < particlesCount; i++) {
        rotations[i] += 0.01;
      }

      particlesGeometry.attributes.rotation.needsUpdate = true;

      for (let i = 0; i < particlesCount * 3; i += 3) {
        const x = positions[i];
        const y = positions[i + 1];

        const distance = Math.sqrt(
          Math.pow(x - mousePosition.current.x * 5, 2) + Math.pow(y - mousePosition.current.y * 5, 2)
        );

        const intensity = Math.max(0, 1 - distance / 2);
        colors[i] = 0.7 + intensity * 0.3;
        colors[i + 1] = 0.7 + intensity * 0.3;
        colors[i + 2] = 1;
      }

      particlesGeometry.attributes.color.needsUpdate = true;
      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      aria-hidden='true'
      className='fixed left-0 top-0 -z-10 h-full w-full'
      ref={containerRef}
    />
  );
};
