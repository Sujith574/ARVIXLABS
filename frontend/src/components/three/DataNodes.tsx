'use client'

import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, Float, Text, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

interface NodeProps {
  position: [number, number, number]
  label: string
  color: string
}

function Node({ position, label, color }: NodeProps) {
  const mesh = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x = Math.sin(state.clock.getElapsedTime()) * 0.2
      mesh.current.rotation.y = Math.cos(state.clock.getElapsedTime()) * 0.2
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group position={position}>
        <Sphere ref={mesh} args={[0.4, 32, 32]}>
          <MeshDistortMaterial
            color={color}
            speed={2}
            distort={0.3}
            radius={1}
            emissive={color}
            emissiveIntensity={0.5}
          />
        </Sphere>
        <Text
          position={[0, -0.7, 0]}
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      </group>
    </Float>
  )
}

export default function DataNodes() {
  const nodes = [
    { label: 'Grievance AI', color: '#3b82f6', pos: [-2, 1, 0] },
    { label: 'RAG Pipeline', color: '#06b6d4', pos: [2, 1.5, -1] },
    { label: 'FAISS Index',  color: '#8b5cf6', pos: [0, -1, 1] },
  ]

  return (
    <group>
      {nodes.map((node, i) => (
        <Node key={i} position={node.pos as any} label={node.label} color={node.color} />
      ))}
    </group>
  )
}
