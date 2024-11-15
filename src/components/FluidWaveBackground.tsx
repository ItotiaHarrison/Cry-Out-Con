import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { motion } from 'framer-motion';

// Simplex Noise implementation
const simplex = `
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0)
    );
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(
      dot(p0, p0),
      dot(p1, p1),
      dot(p2, p2),
      dot(p3, p3)
    ));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    vec4 m = max(0.6 - vec4(
      dot(x0, x0),
      dot(x1, x1),
      dot(x2, x2),
      dot(x3, x3)
    ), 0.0);
    m = m * m;
    return 42.0 * dot(
      m * m,
      vec4(
        dot(p0, x0),
        dot(p1, x1),
        dot(p2, x2),
        dot(p3, x3)
      )
    );
  }
`;

const FluidMesh = () => {
  const meshRef = useRef<THREE.Mesh>();
  const materialRef = useRef<THREE.ShaderMaterial>();

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
      
      // Add pulsing to amplitude and color intensity
      const pulseAmplitude = Math.sin(clock.getElapsedTime() * 0.5) * 0.5 + 1.5;
      const pulseColor = Math.sin(clock.getElapsedTime() * 0.3) * 0.2 + 1.2;
      
      materialRef.current.uniforms.uPulseAmplitude.value = pulseAmplitude;
      materialRef.current.uniforms.uPulseColor.value = pulseColor;
    }
  });

  const uniforms = {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('#8b5cf6') },
    uNoiseScale: { value: 2.0 },
    uNoiseSpeed: { value: 0.3 },
    uWaveAmplitude: { value: 0.3 },
    uPulseAmplitude: { value: 1.0 },
    uPulseColor: { value: 1.0 },
    uOpacity: { value: 0.3 }
  };

  return (
    <mesh ref={meshRef} rotation={[-Math.PI * 0.2, 0, 0]} position={[0, 0, 0]} scale={[2, 2, 2]}>
      <planeGeometry args={[10, 10, 200, 200]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={`
          ${simplex}
          uniform float uTime;
          uniform float uNoiseScale;
          uniform float uNoiseSpeed;
          uniform float uWaveAmplitude;
          uniform float uPulseAmplitude;
          
          varying vec2 vUv;
          varying float vElevation;
          
          void main() {
            vUv = uv;
            vec3 pos = position;
            
            // Primary wave with pulse
            float wave = snoise(vec3(
              position.x * uNoiseScale,
              position.y * uNoiseScale,
              uTime * uNoiseSpeed
            )) * uWaveAmplitude * uPulseAmplitude;
            
            // Secondary faster wave
            wave += snoise(vec3(
              position.x * uNoiseScale * 2.0,
              position.y * uNoiseScale * 2.0,
              uTime * uNoiseSpeed * 1.5
            )) * uWaveAmplitude * 0.5 * uPulseAmplitude;
            
            // Tertiary detail wave
            wave += snoise(vec3(
              position.x * uNoiseScale * 4.0,
              position.y * uNoiseScale * 4.0,
              uTime * uNoiseSpeed * 2.0
            )) * uWaveAmplitude * 0.25 * uPulseAmplitude;
            
            // Add radial pulse
            float distance = length(position.xy);
            float radialPulse = sin(distance * 2.0 - uTime * 2.0) * 0.1 * uPulseAmplitude;
            wave += radialPulse;
            
            pos.z += wave;
            vElevation = wave;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 uColor;
          uniform float uOpacity;
          uniform float uTime;
          uniform float uPulseColor;
          
          varying vec2 vUv;
          varying float vElevation;
          
          void main() {
            float elevation = smoothstep(-1.0, 1.0, vElevation);
            vec3 color = mix(uColor * 0.6, uColor * 1.2, elevation);
            
            // Enhanced gradient with pulse
            float gradient = smoothstep(0.0, 1.0, vUv.y);
            color = mix(color * 0.8, color * 1.4 * uPulseColor, gradient);
            
            // Enhanced shimmer effect
            float shimmer = sin(uTime * 3.0 + vUv.x * 20.0 + vUv.y * 20.0) * 0.15 + 0.95;
            color *= shimmer;
            
            // Radial pulse effect
            float distance = length(vUv - 0.5);
            float radialPulse = sin(distance * 10.0 - uTime * 2.0) * 0.1 + 0.9;
            color *= radialPulse;
            
            // Edge glow
            float edgeGlow = smoothstep(0.4, 0.5, distance) * 0.5;
            color += vec3(0.5, 0.2, 1.0) * edgeGlow * uPulseColor;
            
            gl_FragColor = vec4(color, uOpacity);
          }
        `}
        transparent
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
};

const FluidWaveBackground = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="absolute inset-0 -z-10"
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: false
        }}
        dpr={[1, 2]}
      >
        <FluidMesh />
        <ambientLight intensity={0.8} />
      </Canvas>
    </motion.div>
  );
};

export default FluidWaveBackground;