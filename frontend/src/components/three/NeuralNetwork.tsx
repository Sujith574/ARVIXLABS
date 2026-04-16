'use client'

import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Points, PointMaterial, Line } from '@react-three/drei'
import * as THREE from 'three'

export default function NeuralNetwork() {
  const count = 60
  const lines = useMemo(() => {
    const temp = []
    const points = []
    for (let i = 0; i < count; i++) {
        points.push(new THREE.Vector3(
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10
        ))
    }
    
    // Connect points that are close to each other
    for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
            if (points[i].distanceTo(points[j]) < 3) {
                temp.push([points[i], points[j]])
            }
        }
    }
    return temp
  }, [])

  const lineRefs = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (lineRefs.current) {
      lineRefs.current.rotation.y = state.clock.getElapsedTime() * 0.05
      lineRefs.current.rotation.x = state.clock.getElapsedTime() * 0.03
    }
  })

  return (
    <group ref={lineRefs}>
      {lines.map((points, i) => (
        <Line 
          key={i} 
          points={points} 
          color="#3b82f6" 
          lineWidth={0.5} 
          transparent 
          opacity={0.15} 
        />
      ))}
      <Points>
        <bufferGeometry>
            <bufferAttribute 
                attach="attributes-position"
                count={count}
                array={new Float32Array(count * 3).map(() => (Math.random() - 0.5) * 10)}
                itemSize={3}
            />
        </bufferGeometry>
        <PointMaterial
          transparent
          color="#60a5fa"
          size={0.05}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  )
}
