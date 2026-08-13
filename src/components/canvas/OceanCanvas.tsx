import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface OceanCanvasProps {
  showTrees?: boolean;
}

export const OceanCanvas: React.FC<OceanCanvasProps> = ({ showTrees = true }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer with Warm Goa Sunset Fog
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x1a1226, 0.012);

    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 4.5, 18);
    camera.lookAt(0, 3, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 2. Vibrant Turquoise & Sunset Gold Ocean Shader
    const oceanGeometry = new THREE.PlaneGeometry(320, 320, 128, 128);

    const oceanUniforms = {
      uTime: { value: 0 },
      uColorShallow: { value: new THREE.Color(0x00D2D3) }, // Goa Vibrant Turquoise
      uColorDeep: { value: new THREE.Color(0x0a2239) },    // Deep Ocean Blue
      uColorSun: { value: new THREE.Color(0xFF9F43) }      // Warm Golden Sun Reflection
    };

    const oceanMaterial = new THREE.ShaderMaterial({
      uniforms: oceanUniforms,
      vertexShader: `
        uniform float uTime;
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec2 vUv;

        void main() {
          vUv = uv;
          vec3 pos = position;

          // Natural Goa ocean wave dynamics
          float wave1 = sin(pos.x * 0.12 + uTime * 1.6) * cos(pos.y * 0.12 + uTime * 1.3) * 0.9;
          float wave2 = sin(pos.x * 0.35 - uTime * 2.1) * sin(pos.y * 0.25 + uTime * 1.7) * 0.4;
          float wave3 = cos(pos.x * 0.7 + uTime * 2.8) * 0.18;
          
          pos.z += wave1 + wave2 + wave3;
          vPosition = pos;

          vec3 n = vec3(
            -cos(pos.x * 0.12 + uTime * 1.6) * 0.25,
            -cos(pos.y * 0.12 + uTime * 1.3) * 0.25,
            1.0
          );
          vNormal = normalize(n);

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColorShallow;
        uniform vec3 uColorDeep;
        uniform vec3 uColorSun;
        uniform float uTime;
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec2 vUv;

        void main() {
          // Height-based turquoise ocean color mixing
          float heightFactor = smoothstep(-1.4, 1.4, vPosition.z);
          vec3 oceanColor = mix(uColorDeep, uColorShallow, heightFactor * 0.55);

          // Golden sunset wave reflection specular highlight
          vec3 lightDir = normalize(vec3(0.3, 0.5, 0.8));
          float specular = pow(max(dot(vNormal, lightDir), 0.0), 28.0);
          
          // Subtle sea foam sparkles
          float foam = sin(vPosition.x * 6.0) * sin(vPosition.y * 6.0);
          foam = smoothstep(0.94, 1.0, foam) * 0.2;

          vec3 finalColor = oceanColor + (uColorSun * specular * 0.95) + vec3(foam);
          gl_FragColor = vec4(finalColor, 0.92);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide
    });

    const oceanMesh = new THREE.Mesh(oceanGeometry, oceanMaterial);
    oceanMesh.rotation.x = -Math.PI / 2;
    oceanMesh.position.y = -2;
    scene.add(oceanMesh);

    // 3. Procedural Coconut Palm Tree Generator (Vibrant Tropical Green)
    function createProceduralPalmTree(origin: THREE.Vector3, scale: number = 1.0): THREE.Group {
      const palmGroup = new THREE.Group();
      palmGroup.position.copy(origin);
      palmGroup.scale.setScalar(scale);

      const sectionCount = 14;
      const segmentCount = 10;
      const totalLength = 8.5;
      const baseRadius = 0.38;
      const taperFactor = 0.65;

      const verts: number[] = [];
      const normals: number[] = [];
      const uvs: number[] = [];
      const indices: number[] = [];

      let currentRadius = baseRadius;
      let currentOrigin = new THREE.Vector3(0, 0, 0);
      let currentOrientation = new THREE.Euler(0, 0, 0);

      const sectionOrigins: THREE.Vector3[] = [];

      for (let i = 0; i <= sectionCount; i++) {
        const progress = i / sectionCount;
        
        if (i === sectionCount) {
          currentRadius = 0.08;
        } else {
          currentRadius = baseRadius * (1.0 - taperFactor * progress);
        }

        const curveX = Math.sin(progress * Math.PI * 0.75) * 0.7;
        const curveZ = Math.cos(progress * Math.PI * 0.4) * 0.35;
        currentOrigin = new THREE.Vector3(curveX, progress * totalLength, curveZ);
        currentOrientation = new THREE.Euler(curveZ * 0.12, 0, -curveX * 0.12);

        sectionOrigins.push(currentOrigin.clone());

        for (let j = 0; j < segmentCount; j++) {
          const angle = (2.0 * Math.PI * j) / segmentCount;

          const ringVertex = new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle))
            .multiplyScalar(currentRadius)
            .applyEuler(currentOrientation)
            .add(currentOrigin);

          const ringNormal = new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle))
            .applyEuler(currentOrientation)
            .normalize();

          verts.push(ringVertex.x, ringVertex.y, ringVertex.z);
          normals.push(ringNormal.x, ringNormal.y, ringNormal.z);
          uvs.push(j / segmentCount, progress);
        }
      }

      for (let i = 0; i < sectionCount; i++) {
        for (let j = 0; j < segmentCount; j++) {
          const first = i * segmentCount + j;
          const second = first + segmentCount;
          const nextJ = (j + 1) % segmentCount;
          const firstNext = i * segmentCount + nextJ;
          const secondNext = firstNext + segmentCount;

          indices.push(first, second, firstNext);
          indices.push(second, secondNext, firstNext);
        }
      }

      const trunkGeo = new THREE.BufferGeometry();
      trunkGeo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
      trunkGeo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
      trunkGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
      trunkGeo.setIndex(indices);

      // Natural Coconut Bark Brown
      const trunkMat = new THREE.MeshStandardMaterial({
        color: 0x5c3d2e,
        roughness: 0.8,
        metalness: 0.1
      });

      const trunkMesh = new THREE.Mesh(trunkGeo, trunkMat);
      palmGroup.add(trunkMesh);

      // Top Leaf Crown (Vibrant Goa Palm Leaf Green)
      const topOrigin = sectionOrigins[sectionOrigins.length - 1];
      const leafCount = 9;
      const leafMat = new THREE.MeshStandardMaterial({
        color: 0x2e7d32,
        emissive: 0x1b5e20,
        emissiveIntensity: 0.35,
        roughness: 0.35,
        side: THREE.DoubleSide
      });

      for (let k = 0; k < leafCount; k++) {
        const leafAngle = (2 * Math.PI * k) / leafCount;
        const leafCurve = new THREE.CatmullRomCurve3([
          topOrigin.clone(),
          topOrigin.clone().add(new THREE.Vector3(Math.cos(leafAngle) * 2.0, 0.5, Math.sin(leafAngle) * 2.0)),
          topOrigin.clone().add(new THREE.Vector3(Math.cos(leafAngle) * 3.8, -0.9, Math.sin(leafAngle) * 3.8))
        ]);

        const leafGeo = new THREE.TubeGeometry(leafCurve, 14, 0.22, 6, false);
        const leafMesh = new THREE.Mesh(leafGeo, leafMat);
        palmGroup.add(leafMesh);
      }

      // Golden Coconuts at top
      const coconutGeo = new THREE.SphereGeometry(0.32, 12, 12);
      const coconutMat = new THREE.MeshStandardMaterial({
        color: 0xFF9F43,
        roughness: 0.5
      });

      for (let c = 0; c < 3; c++) {
        const nutAngle = (c * Math.PI * 2) / 3;
        const nutMesh = new THREE.Mesh(coconutGeo, coconutMat);
        nutMesh.position.set(
          topOrigin.x + Math.cos(nutAngle) * 0.4,
          topOrigin.y - 0.25,
          topOrigin.z + Math.sin(nutAngle) * 0.4
        );
        palmGroup.add(nutMesh);
      }

      return palmGroup;
    }

    const palmTreesGroup = new THREE.Group();
    if (showTrees) {
      const tree1 = createProceduralPalmTree(new THREE.Vector3(-12, -2, -4), 1.15);
      const tree2 = createProceduralPalmTree(new THREE.Vector3(13, -2, -6), 1.35);
      const tree3 = createProceduralPalmTree(new THREE.Vector3(-18, -2, -12), 0.95);
      const tree4 = createProceduralPalmTree(new THREE.Vector3(19, -2, -10), 1.05);
      palmTreesGroup.add(tree1, tree2, tree3, tree4);
      scene.add(palmTreesGroup);
    }

    // 4. Warm Sun Dust Particles
    const particleCount = 180;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 60;
      particlePos[i + 1] = Math.random() * 22 - 2;
      particlePos[i + 2] = (Math.random() - 0.5) * 40;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xFF9F43,
      size: 0.18,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 5. Warm Sunset Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xfff3e0, 0.6);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xFF6B6B, 2.0);
    sunLight.position.set(12, 18, 22);
    scene.add(sunLight);

    const pointLightGoa = new THREE.PointLight(0xFF9F43, 2.2, 35);
    pointLightGoa.position.set(0, 6, 6);
    scene.add(pointLightGoa);

    // 6. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      oceanUniforms.uTime.value = elapsedTime;

      if (showTrees) {
        palmTreesGroup.children.forEach((tree, idx) => {
          tree.rotation.z = Math.sin(elapsedTime * 1.2 + idx) * 0.035;
          tree.rotation.x = Math.cos(elapsedTime * 0.9 + idx) * 0.025;
        });
      }

      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 1; i < particleCount * 3; i += 3) {
        positions[i] += Math.sin(elapsedTime + i) * 0.012;
        if (positions[i] > 20) positions[i] = -2;
      }
      particleGeo.attributes.position.needsUpdate = true;

      camera.position.x = Math.sin(elapsedTime * 0.18) * 1.6;
      camera.lookAt(0, 3, 0);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [showTrees]);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{ opacity: 0.95 }}
    />
  );
};
