import React, { useEffect, useRef } from 'react';
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

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 10;
      positions[i + 1] = (Math.random() - 0.5) * 10;
      positions[i + 2] = (Math.random() - 0.5) * 10;

      colors[i] = Math.random() * 0.3 + 0.7;
      colors[i + 1] = Math.random() * 0.3 + 0.7;
      colors[i + 2] = Math.random() * 0.3 + 0.7;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      blending: THREE.AdditiveBlending,
      opacity: 0.8,
      size: 0.02,
      transparent: true,
      vertexColors: true
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    camera.position.z = 5;

    // Mouse move handler
    const handleMouseMove = (event: MouseEvent) => {
      mousePosition.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
      };
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);

      particles.rotation.x += 0.001;
      particles.rotation.y += 0.001;

      const positions = particlesGeometry.attributes.position.array as Float32Array;
      const colors = particlesGeometry.attributes.color.array as Float32Array;

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
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      className='fixed left-0 top-0 -z-10 h-full w-full'
      ref={containerRef}
    />
  );
};
