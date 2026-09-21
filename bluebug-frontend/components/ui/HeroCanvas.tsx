"use client";
import { useEffect, useRef } from "react";
import type * as THREE_TYPE from "three";

export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let animId: number;
    let cleanup: (() => void) | undefined;

    async function init() {
      const THREE = await import("three");
      const canvas = canvasRef.current;
      if (!canvas) return;

      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
      renderer.setClearColor(0x000000, 0);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(55, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
      camera.position.set(0, 0, 16);

      // Mouse tracking state
      const mouse = {
        x: 0,
        y: 0,
        targetX: 0,
        targetY: 0,
        worldPos: new THREE.Vector3(0, 0, 0),
        active: false,
      };

      const shockwaves: Array<{
        pos: THREE_TYPE.Vector3;
        radius: number;
        maxRadius: number;
        speed: number;
        opacity: number;
      }> = [];

      // Background rotating core (Dual Wireframe Polyhedron for depth)
      const coreGroup = new THREE.Group();
      coreGroup.position.set(0, 0, -5);

      const icoGeo = new THREE.IcosahedronGeometry(3.5, 1);
      const icoEdges = new THREE.EdgesGeometry(icoGeo);
      const icoMat = new THREE.LineBasicMaterial({
        color: 0x1481F8,
        transparent: true,
        opacity: 0.14,
      });
      const icoMesh = new THREE.LineSegments(icoEdges, icoMat);
      coreGroup.add(icoMesh);

      const octGeo = new THREE.OctahedronGeometry(2.2, 0);
      const octEdges = new THREE.EdgesGeometry(octGeo);
      const octMat = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.22,
      });
      const octMesh = new THREE.LineSegments(octEdges, octMat);
      coreGroup.add(octMesh);

      scene.add(coreGroup);

      // Particles Setup
      const PARTICLE_COUNT = 170;
      const positions = new Float32Array(PARTICLE_COUNT * 3);
      const velocities: Array<{
        x: number;
        y: number;
        z: number;
        ox: number;
        oy: number;
        oz: number;
      }> = [];

      const BOUNDS_X = 14;
      const BOUNDS_Y = 9;
      const BOUNDS_Z = 5;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const x = (Math.random() - 0.5) * (BOUNDS_X * 2);
        const y = (Math.random() - 0.5) * (BOUNDS_Y * 2);
        const z = (Math.random() - 0.5) * (BOUNDS_Z * 2);
        positions[i * 3]     = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        velocities.push({
          x: (Math.random() - 0.5) * 0.012,
          y: (Math.random() - 0.5) * 0.012,
          z: (Math.random() - 0.5) * 0.008,
          ox: (Math.random() - 0.5) * 0.004,
          oy: (Math.random() - 0.5) * 0.004,
          oz: (Math.random() - 0.5) * 0.002,
        });
      }

      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

      // Particle dots with smooth circular gradient
      const canvasTexture = document.createElement("canvas");
      canvasTexture.width = 32;
      canvasTexture.height = 32;
      const ctx = canvasTexture.getContext("2d");
      if (ctx) {
        const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        grad.addColorStop(0, "rgba(255, 255, 255, 1)");
        grad.addColorStop(0.3, "rgba(56, 189, 248, 0.9)");
        grad.addColorStop(0.7, "rgba(20, 129, 248, 0.4)");
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 32, 32);
      }
      const pTexture = new THREE.CanvasTexture(canvasTexture);

      const pMat = new THREE.PointsMaterial({
        size: 0.18,
        map: pTexture,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const points = new THREE.Points(pGeo, pMat);
      scene.add(points);

      // Line mesh for inter-particle and mouse connections
      const MAX_LINES = 1200;
      const linePositions = new Float32Array(MAX_LINES * 6);
      const lineColors = new Float32Array(MAX_LINES * 6);
      const lineGeo = new THREE.BufferGeometry();
      lineGeo.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
      lineGeo.setAttribute("color", new THREE.BufferAttribute(lineColors, 3));

      const lineMat = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const linesMesh = new THREE.LineSegments(lineGeo, lineMat);
      scene.add(linesMesh);

      // Convert screen mouse to 3D world position
      const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
      const raycaster = new THREE.Raycaster();

      const onMouseMove = (e: MouseEvent) => {
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        mouse.targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.targetY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        mouse.active = true;

        raycaster.setFromCamera(new THREE.Vector2(mouse.targetX, mouse.targetY), camera);
        raycaster.ray.intersectPlane(planeZ, mouse.worldPos);
      };

      const onMouseLeave = () => {
        mouse.active = false;
      };

      const onClick = (e: MouseEvent) => {
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const clickX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const clickY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        const clickWorld = new THREE.Vector3();
        raycaster.setFromCamera(new THREE.Vector2(clickX, clickY), camera);
        raycaster.ray.intersectPlane(planeZ, clickWorld);

        shockwaves.push({
          pos: clickWorld,
          radius: 0.1,
          maxRadius: 9.0,
          speed: 0.22,
          opacity: 1.0,
        });
      };

      window.addEventListener("mousemove", onMouseMove);
      canvas.addEventListener("mouseleave", onMouseLeave);
      window.addEventListener("click", onClick);

      const onResize = () => {
        if (!canvas) return;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
      };
      window.addEventListener("resize", onResize);

      // Animation Loop
      function animate() {
        animId = requestAnimationFrame(animate);

        // Lerp mouse coordinates
        mouse.x += (mouse.targetX - mouse.x) * 0.08;
        mouse.y += (mouse.targetY - mouse.y) * 0.08;

        // Camera gentle drift
        camera.position.x += (mouse.x * 1.5 - camera.position.x) * 0.03;
        camera.position.y += (mouse.y * 1.0 - camera.position.y) * 0.03;
        camera.lookAt(0, 0, 0);

        // Rotate background core
        // Audio reactive scale & rotation boost
        let audioBoost = 1.0;
        const audioAnalyser = typeof window !== "undefined" ? (window as any).__audioAnalyser : null;
        if (audioAnalyser) {
          const freqData = new Uint8Array(audioAnalyser.frequencyBinCount);
          audioAnalyser.getByteFrequencyData(freqData);
          const avg = freqData.reduce((acc: number, val: number) => acc + val, 0) / (freqData.length * 255);
          audioBoost = 1.0 + avg * 1.2;
        }

        coreGroup.scale.set(audioBoost, audioBoost, audioBoost);
        coreGroup.rotation.x += 0.002 * audioBoost;
        coreGroup.rotation.y += 0.0035 * audioBoost;
        octMesh.rotation.x -= 0.004 * audioBoost;
        octMesh.rotation.y += 0.003 * audioBoost;

        // Process shockwaves
        for (let s = shockwaves.length - 1; s >= 0; s--) {
          const sw = shockwaves[s];
          sw.radius += sw.speed;
          sw.opacity = Math.max(0, 1 - sw.radius / sw.maxRadius);
          if (sw.radius >= sw.maxRadius) {
            shockwaves.splice(s, 1);
          }
        }

        const posAttr = pGeo.attributes.position as THREE_TYPE.BufferAttribute;
        const posArray = posAttr.array as Float32Array;

        // Update particles
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const ix = i * 3;
          const iy = i * 3 + 1;
          const iz = i * 3 + 2;

          let px = posArray[ix];
          let py = posArray[iy];
          let pz = posArray[iz];

          const v = velocities[i];

          // Natural drift
          px += v.x;
          py += v.y;
          pz += v.z;

          // Mouse repulsion force
          if (mouse.active) {
            const dx = px - mouse.worldPos.x;
            const dy = py - mouse.worldPos.y;
            const dz = pz - mouse.worldPos.z;
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
            const repelRadius = 4.2;

            if (dist < repelRadius && dist > 0.01) {
              const force = (1 - dist / repelRadius) * 0.08;
              px += (dx / dist) * force;
              py += (dy / dist) * force;
              pz += (dz / dist) * force * 0.5;
            }
          }

          // Shockwave impulse
          for (let s = 0; s < shockwaves.length; s++) {
            const sw = shockwaves[s];
            const dx = px - sw.pos.x;
            const dy = py - sw.pos.y;
            const dz = pz - sw.pos.z;
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
            const waveDiff = Math.abs(dist - sw.radius);

            if (waveDiff < 1.2 && dist > 0.01) {
              const push = (1 - waveDiff / 1.2) * 0.12 * sw.opacity;
              px += (dx / dist) * push;
              py += (dy / dist) * push;
              pz += (dz / dist) * push;
            }
          }

          // Boundary wrapping
          if (px > BOUNDS_X) px = -BOUNDS_X;
          if (px < -BOUNDS_X) px = BOUNDS_X;
          if (py > BOUNDS_Y) py = -BOUNDS_Y;
          if (py < -BOUNDS_Y) py = BOUNDS_Y;
          if (pz > BOUNDS_Z) pz = -BOUNDS_Z;
          if (pz < -BOUNDS_Z) pz = BOUNDS_Z;

          posArray[ix] = px;
          posArray[iy] = py;
          posArray[iz] = pz;
        }
        posAttr.needsUpdate = true;

        // Build connecting lines
        let lineIdx = 0;
        const linePosAttr = lineGeo.attributes.position as THREE_TYPE.BufferAttribute;
        const lineColAttr = lineGeo.attributes.color as THREE_TYPE.BufferAttribute;
        const lPositions = linePosAttr.array as Float32Array;
        const lColors = lineColAttr.array as Float32Array;

        const maxDist = 2.8;

        // 1. Inter-particle connections
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const x1 = posArray[i * 3];
          const y1 = posArray[i * 3 + 1];
          const z1 = posArray[i * 3 + 2];

          for (let j = i + 1; j < PARTICLE_COUNT; j++) {
            if (lineIdx >= MAX_LINES - 20) break;

            const x2 = posArray[j * 3];
            const y2 = posArray[j * 3 + 1];
            const z2 = posArray[j * 3 + 2];

            const dx = x1 - x2;
            const dy = y1 - y2;
            const dz = z1 - z2;
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (dist < maxDist) {
              const alpha = (1 - dist / maxDist) * 0.38;

              // Vertex 1
              lPositions[lineIdx * 6]     = x1;
              lPositions[lineIdx * 6 + 1] = y1;
              lPositions[lineIdx * 6 + 2] = z1;
              lColors[lineIdx * 6]        = 0.08 * alpha;
              lColors[lineIdx * 6 + 1]    = 0.50 * alpha;
              lColors[lineIdx * 6 + 2]    = 0.97 * alpha;

              // Vertex 2
              lPositions[lineIdx * 6 + 3] = x2;
              lPositions[lineIdx * 6 + 4] = y2;
              lPositions[lineIdx * 6 + 5] = z2;
              lColors[lineIdx * 6 + 3]    = 0.22 * alpha;
              lColors[lineIdx * 6 + 4]    = 0.74 * alpha;
              lColors[lineIdx * 6 + 5]    = 0.97 * alpha;

              lineIdx++;
            }
          }
        }

        // 2. Dynamic Laser Connector Beams to Mouse Node
        if (mouse.active) {
          const distances: Array<{ index: number; dist: number }> = [];
          for (let i = 0; i < PARTICLE_COUNT; i++) {
            const dx = posArray[i * 3] - mouse.worldPos.x;
            const dy = posArray[i * 3 + 1] - mouse.worldPos.y;
            const dz = posArray[i * 3 + 2] - mouse.worldPos.z;
            distances.push({ index: i, dist: Math.sqrt(dx * dx + dy * dy + dz * dz) });
          }
          distances.sort((a, b) => a.dist - b.dist);

          const connectCount = Math.min(8, distances.length);
          for (let k = 0; k < connectCount; k++) {
            if (lineIdx >= MAX_LINES) break;
            const target = distances[k];
            if (target.dist < 5.5) {
              const alpha = (1 - target.dist / 5.5) * 0.75;
              const pIdx = target.index;

              // Mouse end (glow cyan)
              lPositions[lineIdx * 6]     = mouse.worldPos.x;
              lPositions[lineIdx * 6 + 1] = mouse.worldPos.y;
              lPositions[lineIdx * 6 + 2] = mouse.worldPos.z;
              lColors[lineIdx * 6]        = 0.40 * alpha;
              lColors[lineIdx * 6 + 1]    = 0.85 * alpha;
              lColors[lineIdx * 6 + 2]    = 1.00 * alpha;

              // Particle end
              lPositions[lineIdx * 6 + 3] = posArray[pIdx * 3];
              lPositions[lineIdx * 6 + 4] = posArray[pIdx * 3 + 1];
              lPositions[lineIdx * 6 + 5] = posArray[pIdx * 3 + 2];
              lColors[lineIdx * 6 + 3]    = 0.08 * alpha;
              lColors[lineIdx * 6 + 4]    = 0.50 * alpha;
              lColors[lineIdx * 6 + 5]    = 0.97 * alpha;

              lineIdx++;
            }
          }
        }

        lineGeo.setDrawRange(0, lineIdx * 2);
        linePosAttr.needsUpdate = true;
        lineColAttr.needsUpdate = true;

        renderer.render(scene, camera);
      }
      animate();

      cleanup = () => {
        window.removeEventListener("mousemove", onMouseMove);
        canvas.removeEventListener("mouseleave", onMouseLeave);
        window.removeEventListener("click", onClick);
        window.removeEventListener("resize", onResize);
        cancelAnimationFrame(animId);
        renderer.dispose();
      };
    }

    init();

    return () => {
      cancelAnimationFrame(animId);
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.9,
      }}
      aria-hidden="true"
    />
  );
}
