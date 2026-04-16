'use client'

import React from 'react'
import { Canvas } from '@react-three/fiber'
import NeuralNetwork from './NeuralNetwork'
import DataNodes from './DataNodes'

export default function ThreeBackground() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none bg-[#000828]">
      <Canvas camera={{ position: [0, 0, 7], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <NeuralNetwork />
        <DataNodes />
      </Canvas>
    </div>
  )
}
