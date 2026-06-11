import { Suspense, useRef, useState, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import JointHotspot from './JointHotspot';

// ============================================================================
// CONFIG — Desired world-space height for the normalized skeleton
// ============================================================================
const TARGET_HEIGHT = 3.5;

// ============================================================================
// Joint mapping — proportional positions relative to bounding box
// Values are fractions [0..1] of the (width, height, depth) of the bbox.
// Origin is bbox min corner; Y=0 is bottom, Y=1 is top.
// ============================================================================
const JOINT_PROPORTIONS = [
  {
    key: 'ombro',
    name: 'Ombro',
    // Glenohumeral joint — lateral at shoulder height
    xFrac: 0.69,
    yFrac: 0.81,
    zFrac: 0.42,
  },
  {
    key: 'coluna',
    name: 'Coluna',
    // Mid-thoracic spine — centered, posterior
    xFrac: 0.50,
    yFrac: 0.70,
    zFrac: 0.30,
  },
  {
    key: 'quadril',
    name: 'Quadril',
    // Acetabulum / hip socket
    xFrac: 0.62,
    yFrac: 0.50,
    zFrac: 0.45,
  },
  {
    key: 'joelho',
    name: 'Joelho',
    // Patella / knee joint
    xFrac: 0.59,
    yFrac: 0.27,
    zFrac: 0.48,
  },
];

// ============================================================================
// SkeletonModel — loads GLB, computes bounding box, normalizes, emits metrics
// ============================================================================
function SkeletonModel({ onMetrics }) {
  const groupRef = useRef();
  const { scene } = useGLTF('/HUMANSKELETON-v1.glb');

  // Clone scene to avoid shared-state issues with drei cache
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    if (!clonedScene) return;

    // --- Step 1: Traverse all meshes, compute unified bounding box ----------
    const box = new THREE.Box3();
    clonedScene.traverse((child) => {
      if (child.isMesh && child.geometry) {
        child.geometry.computeBoundingBox();
        const childBox = child.geometry.boundingBox.clone();
        childBox.applyMatrix4(child.matrixWorld);
        box.union(childBox);
      }
    });

    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    // --- Step 2: Log diagnostic info ----------------------------------------
    console.group('[SIORT 3D] 📐 Bounding Box Diagnostics');
    console.log(`Min:    (${box.min.x.toFixed(4)}, ${box.min.y.toFixed(4)}, ${box.min.z.toFixed(4)})`);
    console.log(`Max:    (${box.max.x.toFixed(4)}, ${box.max.y.toFixed(4)}, ${box.max.z.toFixed(4)})`);
    console.log(`Size:   W=${size.x.toFixed(4)}  H=${size.y.toFixed(4)}  D=${size.z.toFixed(4)}`);
    console.log(`Center: (${center.x.toFixed(4)}, ${center.y.toFixed(4)}, ${center.z.toFixed(4)})`);
    console.groupEnd();

    // --- Step 3: Compute adaptive scale factor ------------------------------
    const maxDim = Math.max(size.x, size.y, size.z);
    const scaleFactor = maxDim > 0 ? TARGET_HEIGHT / maxDim : 1;

    console.log(`[SIORT 3D] 🔧 Scale factor: ${scaleFactor.toFixed(6)} (target height: ${TARGET_HEIGHT})`);

    // --- Step 4: Emit metrics (bbox in world space after normalization) ------
    if (onMetrics) {
      onMetrics({
        originalSize: size.clone(),
        originalCenter: center.clone(),
        min: box.min.clone(),
        max: box.max.clone(),
        scaleFactor,
      });
    }
  }, [clonedScene, onMetrics]);

  // --- Apply holographic material to all meshes ---------------------------
  useEffect(() => {
    if (!clonedScene) return;
    const holoMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#e0f0ff'),
      emissive: new THREE.Color('#5BB5F5'),
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.55,
      roughness: 0.15,
      metalness: 0.95,
      side: THREE.DoubleSide,
      envMapIntensity: 1.5,
    });

    clonedScene.traverse((child) => {
      if (child.isMesh) {
        child.material = holoMaterial;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [clonedScene]);

  return (
    <group ref={groupRef}>
      <primitive object={clonedScene} />
    </group>
  );
}

useGLTF.preload('/HUMANSKELETON-v1.glb');

// ============================================================================
// FloorGrid
// ============================================================================
function FloorGrid({ yPosition }) {
  return (
    <gridHelper
      args={[12, 24, '#144272', '#0a1628']}
      position={[0, yPosition, 0]}
    />
  );
}

// ============================================================================
// SceneContent — inner component that uses metrics to place everything
// ============================================================================
function SceneContent({ selectedJoint, onSelectJoint }) {
  const [metrics, setMetrics] = useState(null);

  // Compute absolute hotspot positions from proportional fractions + bbox
  const jointPositions = useMemo(() => {
    if (!metrics) return [];

    const { min, max, scaleFactor } = metrics;
    const size = new THREE.Vector3().subVectors(max, min);
    const center = new THREE.Vector3().addVectors(min, max).multiplyScalar(0.5);

    return JOINT_PROPORTIONS.map((j) => {
      // Convert fraction to bbox-local coordinate
      const localX = min.x + size.x * j.xFrac;
      const localY = min.y + size.y * j.yFrac;
      const localZ = min.z + size.z * j.zFrac;

      // Apply the same transform as the model group: scale, then offset to center
      const worldX = (localX - center.x) * scaleFactor;
      const worldY = (localY - center.y) * scaleFactor;
      const worldZ = (localZ - center.z) * scaleFactor;

      return {
        key: j.key,
        name: j.name,
        position: [worldX, worldY, worldZ],
      };
    });
  }, [metrics]);

  // Compute the model group transform (center + scale)
  const { groupPosition, groupScale, floorY } = useMemo(() => {
    if (!metrics) {
      return {
        groupPosition: [0, 0, 0],
        groupScale: [1, 1, 1],
        floorY: -2,
      };
    }

    const { originalCenter, scaleFactor, min } = metrics;
    const s = scaleFactor;

    // Shift model so its center is at origin, then scale
    const px = -originalCenter.x * s;
    const py = -originalCenter.y * s;
    const pz = -originalCenter.z * s;

    // Floor at the bottom of the normalized model
    const normalizedMinY = (min.y - originalCenter.y) * s;

    return {
      groupPosition: [px, py, pz],
      groupScale: [s, s, s],
      floorY: normalizedMinY - 0.05,
    };
  }, [metrics]);

  // Log hotspot positions for debugging
  useEffect(() => {
    if (jointPositions.length > 0) {
      console.group('[SIORT 3D] 📍 Computed Hotspot Positions (world space)');
      jointPositions.forEach((j) => {
        console.log(`${j.name}: [${j.position.map((v) => v.toFixed(3)).join(', ')}]`);
      });
      console.groupEnd();
    }
  }, [jointPositions]);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 5, 5]} intensity={1.2} color="#c8ddf5" />
      <directionalLight position={[-3, 2, -3]} intensity={0.5} color="#5BB5F5" />
      <pointLight position={[0, 3, 2]} intensity={0.8} color="#5BB5F5" distance={8} />

      {/* Normalized model group */}
      <Suspense fallback={null}>
        <group position={groupPosition} scale={groupScale}>
          <SkeletonModel onMetrics={setMetrics} />
        </group>
      </Suspense>

      {/* Joint Hotspots — placed in world coordinates matching the normalized model */}
      {jointPositions.map((joint) => (
        <JointHotspot
          key={joint.key}
          position={joint.position}
          name={joint.name}
          isActive={selectedJoint === joint.key}
          onClick={() => onSelectJoint(joint.key)}
        />
      ))}

      {/* Floor */}
      <FloorGrid yPosition={floorY} />

      {/* Camera controls */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.3}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.8}
      />
    </>
  );
}

// ============================================================================
// BodyCanvas — public component
// ============================================================================
export default function BodyCanvas({ selectedJoint, onSelectJoint }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 40 }}
      dpr={[1, 2]}
      style={{ background: 'transparent' }}
    >
      <SceneContent
        selectedJoint={selectedJoint}
        onSelectJoint={onSelectJoint}
      />
    </Canvas>
  );
}
