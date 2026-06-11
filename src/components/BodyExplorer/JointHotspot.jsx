import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';

export default function JointHotspot({ position, name, isActive, onClick, onHover, onUnhover }) {
  const meshRef = useRef();
  const glowRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();

    // Pulse animation
    const scale = isActive ? 1.4 : 1 + Math.sin(t * 2 + position[0]) * 0.15;
    meshRef.current.scale.setScalar(scale);

    // Glow ring pulse
    if (glowRef.current) {
      const glowScale = isActive ? 2.2 : 1.5 + Math.sin(t * 1.5 + position[1]) * 0.3;
      glowRef.current.scale.setScalar(glowScale);
      glowRef.current.material.opacity = isActive ? 0.4 : 0.15 + Math.sin(t * 2) * 0.1;
    }
  });

  return (
    <group position={position}>
      {/* Outer glow ring */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial
          color={isActive ? '#FFD700' : '#FF8C42'}
          transparent
          opacity={0.25}
          depthWrite={false}
        />
      </mesh>

      {/* Core hotspot */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
          onHover?.();
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'auto';
          onUnhover?.();
        }}
      >
        <sphereGeometry args={[0.08, 24, 24]} />
        <meshStandardMaterial
          color={isActive ? '#FFD700' : '#FF8C42'}
          emissive={isActive ? '#FF6B00' : '#FF5500'}
          emissiveIntensity={isActive ? 2.0 : 1.2}
          roughness={0.2}
          metalness={0.6}
        />
      </mesh>

      {/* Label */}
      <Html
        position={[0.2, 0.15, 0]}
        center={false}
        style={{
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        <div
          style={{
            background: isActive
              ? 'rgba(91, 181, 245, 0.25)'
              : 'rgba(10, 38, 71, 0.75)',
            backdropFilter: 'blur(8px)',
            color: isActive ? '#fff' : '#94A3B8',
            fontSize: '11px',
            fontWeight: isActive ? 700 : 500,
            fontFamily: 'Inter, sans-serif',
            padding: '3px 10px',
            borderRadius: '20px',
            border: `1px solid ${isActive ? 'rgba(255,140,66,0.6)' : 'rgba(255,140,66,0.25)'}`,
            transition: 'all 0.25s ease',
            userSelect: 'none',
          }}
        >
          {name}
        </div>
      </Html>
    </group>
  );
}
