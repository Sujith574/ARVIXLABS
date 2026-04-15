'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

function StarField() {
  const ref = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const pos = new Float32Array(3000 * 3)
    for (let i = 0; i < 3000; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 40
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40
    }
    return pos
  }, [])

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta * 0.02
      ref.current.rotation.y -= delta * 0.03
    }
  })

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#60a5fa"
        size={0.04}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </Points>
  )
}

function GridPlane() {
  const ref = useRef<THREE.GridHelper>(null)
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.position.z = (ref.current.position.z + delta * 0.5) % 2
    }
  })
  return <gridHelper ref={ref} args={[60, 40, '#1d4ed8', '#1e3a5f']} position={[0, -3, 0]} rotation={[0, 0, 0]} />
}

function DataNodes() {
  const nodes = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 10,
      y: (Math.random() - 0.5) * 5,
      z: (Math.random() - 0.5) * 6,
      speed: 0.3 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
      color: i % 3 === 0 ? '#22d3ee' : i % 3 === 1 ? '#3b82f6' : '#a78bfa',
    })),
  [])

  const groupRef = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (!groupRef.current) return
    groupRef.current.children.forEach((child, i) => {
      const n = nodes[i]
      if (child) {
        child.position.y += Math.sin(clock.elapsedTime * n.speed + n.phase) * 0.002
      }
    })
  })

  return (
    <group ref={groupRef}>
      {nodes.map((n) => (
        <mesh key={n.id} position={[n.x, n.y, n.z]}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial
            color={n.color}
            emissive={n.color}
            emissiveIntensity={0.8}
            transparent
            opacity={0.9}
          />
        </mesh>
      ))}
    </group>
  )
}

export default function HeroScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 2, 12], fov: 55 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
        performance={{ min: 0.5 }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#3b82f6" />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#22d3ee" />
        <StarField />
        <GridPlane />
        <DataNodes />
      </Canvas>
    </div>
  )
}
