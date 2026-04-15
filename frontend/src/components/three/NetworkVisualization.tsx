'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Node({ position, color }: { position: [number, number, number]; color: string }) {
  const ref = useRef<THREE.Mesh>(null)
  const speed = useMemo(() => 0.4 + Math.random() * 0.6, [])
  const phase = useMemo(() => Math.random() * Math.PI * 2, [])

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(clock.elapsedTime * speed + phase) * 0.3
      ref.current.rotation.y += 0.01
    }
  })

  return (
    <mesh ref={ref} position={position}>
      <octahedronGeometry args={[0.2, 0]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} wireframe />
    </mesh>
  )
}

function Connections({ nodes }: { nodes: { pos: [number, number, number] }[] }) {
  const lineRef = useRef<THREE.LineSegments>(null)

  const geometry = useMemo(() => {
    const points: number[] = []
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i].pos
        const b = nodes[j].pos
        const dist = Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])
        if (dist < 4) {
          points.push(...a, ...b)
        }
      }
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(points, 3))
    return geo
  }, [nodes])

  return (
    <lineSegments ref={lineRef} geometry={geometry}>
      <lineBasicMaterial color="#1d4ed8" transparent opacity={0.3} />
    </lineSegments>
  )
}

function NetworkGraph() {
  const colors = ['#3b82f6', '#22d3ee', '#a78bfa', '#f59e0b', '#10b981']
  const nodes = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      pos: [
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
      ] as [number, number, number],
      color: colors[i % colors.length],
    })),
  [])

  const groupRef = useRef<THREE.Group>(null)
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05
    }
  })

  return (
    <group ref={groupRef}>
      <Connections nodes={nodes} />
      {nodes.map((n, i) => (
        <Node key={i} position={n.pos} color={n.color} />
      ))}
    </group>
  )
}

export default function NetworkVisualization() {
  return (
    <div className="w-full h-80 rounded-2xl overflow-hidden" style={{ background: 'rgba(0,0,0,0.2)' }}>
      <Canvas
        camera={{ position: [0, 0, 14], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        performance={{ min: 0.5 }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 5]} intensity={0.8} color="#3b82f6" />
        <pointLight position={[-10, -5, -5]} intensity={0.5} color="#22d3ee" />
        <NetworkGraph />
      </Canvas>
    </div>
  )
}
