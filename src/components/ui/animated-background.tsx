
'use client';

import * as THREE from 'three';
import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';

function Stars(props: any) {
  const ref = useRef<THREE.Points>(null!);
  const { positions, colors } = useMemo(() => {
    const count = 5000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const r = 4 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = r * Math.cos(phi);
      
      const color = new THREE.Color();
      color.setHSL(Math.random(), 0.7, 0.8);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }
    return { positions, colors };
  }, []);

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 20;
    ref.current.rotation.y -= delta / 25;
    
    // Mouse interaction
    const { pointer } = state;
    const targetRotationX = pointer.y * 0.3;
    const targetRotationY = -pointer.x * 0.3;
    
    ref.current.rotation.x += (targetRotationX - ref.current.rotation.x) * 0.02;
    ref.current.rotation.y += (targetRotationY - ref.current.rotation.y) * 0.02;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false} {...props}>
      <PointMaterial
        transparent
        vertexColors
        size={0.025}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </Points>
  );
}

export function AnimatedBackground() {
  return (
    <Canvas camera={{ position: [0, 0, 1], fov: 75 }}>
      <Stars />
    </Canvas>
  );
}
