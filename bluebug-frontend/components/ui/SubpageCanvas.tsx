"use client";
import { useEffect, useRef } from "react";
import type * as THREE_TYPE from "three";

export function SubpageCanvas() {
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
      const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
      camera.position.set(0, 0, 13);

      const mouse = { x: 0, y: 0, targetX: 0, targetY: 0, active: false };
      let surge = 1.0;

      // Master 3D Gyroscope & Energy Core Group
      const gyroGroup = new THREE.Group();
      // On wide screens offset slightly right to frame text; on mobile centered
      const isMobile = window.innerWidth < 768;
      gyroGroup.position.set(isMobile ? 0 : 4.8, 0, 0);
      scene.add(gyroGroup);

      // 1. Outer Gimbal Ring (Torus wireframe)
      const ring1Geo = new THREE.TorusGeometry(3.6, 0.03, 16, 100);
      const ring1Mat = new THREE.MeshBasicMaterial({
        color: 0x1481F8,
        transparent: true,
        opacity: 0.35,
      });
      const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
      gyroGroup.add(ring1);

      // Ring 1 tick markers
      const tickGeo = new THREE.BufferGeometry();
      const tickCount = 48;
      const tickPositions = new Float32Array(tickCount * 6);
      for (let i = 0; i < tickCount; i++) {
        const angle = (i / tickCount) * Math.PI * 2;
        const r1 = 3.5;
        const r2 = 3.7;
        tickPositions[i * 6]     = Math.cos(angle) * r1;
        tickPositions[i * 6 + 1] = Math.sin(angle) * r1;
        tickPositions[i * 6 + 2] = 0;
        tickPositions[i * 6 + 3] = Math.cos(angle) * r2;
        tickPositions[i * 6 + 4] = Math.sin(angle) * r2;
        tickPositions[i * 6 + 5] = 0;
      }
      tickGeo.setAttribute("position", new THREE.BufferAttribute(tickPositions, 3));
      const tickMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.45 });
      const ticks = new THREE.LineSegments(tickGeo, tickMat);
      gyroGroup.add(ticks);

      // 2. Mid Gimbal Ring (45 degree tilt)
      const ring2Geo = new THREE.TorusGeometry(2.7, 0.025, 16, 80);
      const ring2Mat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.5,
      });
      const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
      ring2.rotation.x = Math.PI * 0.35;
      ring2.rotation.y = Math.PI * 0.2;
      gyroGroup.add(ring2);

      // 3. Inner Gimbal Ring (-35 degree tilt)
      const ring3Geo = new THREE.TorusGeometry(1.9, 0.02, 16, 64);
      const ring3Mat = new THREE.MeshBasicMaterial({
        color: 0x1481F8,
        transparent: true,
        opacity: 0.65,
      });
      const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
      ring3.rotation.x = -Math.PI * 0.25;
      ring3.rotation.z = Math.PI * 0.3;
      gyroGroup.add(ring3);

      // 4. Central Geodesic Quantum Nucleus
      const nucleusGeo = new THREE.IcosahedronGeometry(1.1, 1);
      const nucleusEdges = new THREE.EdgesGeometry(nucleusGeo);
      const nucleusMat = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.75,
      });
      const nucleusMesh = new THREE.LineSegments(nucleusEdges, nucleusMat);
      gyroGroup.add(nucleusMesh);

      // Inner glowing core sphere
      const innerCoreGeo = new THREE.OctahedronGeometry(0.55, 0);
      const innerCoreEdges = new THREE.EdgesGeometry(innerCoreGeo);
      const innerCoreMat = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.85,
      });
      const innerCore = new THREE.LineSegments(innerCoreEdges, innerCoreMat);
      gyroGroup.add(innerCore);

      // 5. Circular Glowing Sprite Texture for particles
      const spriteCanvas = document.createElement("canvas");
      spriteCanvas.width = 32;
      spriteCanvas.height = 32;
      const sCtx = spriteCanvas.getContext("2d");
      if (sCtx) {
        const grad = sCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
        grad.addColorStop(0, "rgba(255, 255, 255, 1)");
        grad.addColorStop(0.25, "rgba(56, 189, 248, 0.95)");
        grad.addColorStop(0.65, "rgba(20, 129, 248, 0.35)");
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");
        sCtx.fillStyle = grad;
        sCtx.fillRect(0, 0, 32, 32);
      }
      const pTexture = new THREE.CanvasTexture(spriteCanvas);

      // 6. Orbiting Particle Swarm
      const ORBIT_PARTICLES = 130;
      const pPositions = new Float32Array(ORBIT_PARTICLES * 3);
      const particleMeta: Array<{ radius: number; speed: number; angle: number; tilt: number; phi: number }> = [];

      for (let i = 0; i < ORBIT_PARTICLES; i++) {
        const r = 1.6 + Math.random() * 2.8;
        const speed = (0.008 + Math.random() * 0.018) * (Math.random() > 0.5 ? 1 : -1);
        const angle = Math.random() * Math.PI * 2;
        const tilt = (Math.random() - 0.5) * Math.PI;
        const phi = (Math.random() - 0.5) * 1.5;

        particleMeta.push({ radius: r, speed, angle, tilt, phi });

        pPositions[i * 3]     = Math.cos(angle) * r;
        pPositions[i * 3 + 1] = Math.sin(angle) * r * Math.sin(tilt) + phi;
        pPositions[i * 3 + 2] = Math.sin(angle) * r * Math.cos(tilt);
      }

      const orbitGeo = new THREE.BufferGeometry();
      orbitGeo.setAttribute("position", new THREE.BufferAttribute(pPositions, 3));
      const orbitMat = new THREE.PointsMaterial({
        size: 0.18,
        map: pTexture,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const orbitSwarm = new THREE.Points(orbitGeo, orbitMat);
      gyroGroup.add(orbitSwarm);

      // 7. Ambient Wide Stars / Cyber Dust
      const DUST_COUNT = 70;
      const dustPos = new Float32Array(DUST_COUNT * 3);
      for (let i = 0; i < DUST_COUNT; i++) {
        dustPos[i * 3]     = (Math.random() - 0.5) * 26;
        dustPos[i * 3 + 1] = (Math.random() - 0.5) * 14;
        dustPos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
      }
      const dustGeo = new THREE.BufferGeometry();
      dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
      const dustMat = new THREE.PointsMaterial({
        size: 0.1,
        map: pTexture,
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const dustMesh = new THREE.Points(dustGeo, dustMat);
      scene.add(dustMesh);

      // Dynamic Laser Connector Lines from nucleus to orbiting particles
      const MAX_CORE_LINES = 12;
      const coreLinePos = new Float32Array(MAX_CORE_LINES * 6);
      const coreLineGeo = new THREE.BufferGeometry();
      coreLineGeo.setAttribute("position", new THREE.BufferAttribute(coreLinePos, 3));
      const coreLineMat = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
      });
      const coreLines = new THREE.LineSegments(coreLineGeo, coreLineMat);
      gyroGroup.add(coreLines);

      // Mouse & Click Listeners
      const onMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        mouse.targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.targetY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        mouse.active = true;
      };

      const onMouseLeave = () => {
        mouse.active = false;
        mouse.targetX = 0;
        mouse.targetY = 0;
      };

      const onClick = () => {
        // Surge spin & scale on click
        surge = 2.8;
      };

      window.addEventListener("mousemove", onMouseMove);
      canvas.addEventListener("mouseleave", onMouseLeave);
      window.addEventListener("click", onClick);

      const onResize = () => {
        if (!canvas) return;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        const mob = window.innerWidth < 768;
        gyroGroup.position.set(mob ? 0 : 4.8, 0, 0);
      };
      window.addEventListener("resize", onResize);

      let t = 0;

      function animate() {
        animId = requestAnimationFrame(animate);
        t += 0.015;

        // Damping surge back to 1.0
        surge += (1.0 - surge) * 0.03;

        // Smooth mouse tracking
        mouse.x += (mouse.targetX - mouse.x) * 0.05;
        mouse.y += (mouse.targetY - mouse.y) * 0.05;

        // Gyroscope dynamic 3D tilt tracking cursor
        const targetRotX = mouse.y * 0.8 + Math.sin(t * 0.5) * 0.1;
        const targetRotY = mouse.x * 1.1 + Math.cos(t * 0.4) * 0.1;
        gyroGroup.rotation.x += (targetRotX - gyroGroup.rotation.x) * 0.06;
        gyroGroup.rotation.y += (targetRotY - gyroGroup.rotation.y) * 0.06;

        // Independent Ring Rotations
        ring1.rotation.z += 0.005 * surge;
        ticks.rotation.z += 0.005 * surge;
        ring2.rotation.x += 0.008 * surge;
        ring2.rotation.y -= 0.006 * surge;
        ring3.rotation.y += 0.012 * surge;
        ring3.rotation.z -= 0.009 * surge;

        // Nucleus Counter-Spin & Pulse
        nucleusMesh.rotation.x -= 0.01 * surge;
        nucleusMesh.rotation.y += 0.015 * surge;
        const pulse = 1.0 + Math.sin(t * 3.5) * 0.08 * surge;
        nucleusMesh.scale.setScalar(pulse);

        innerCore.rotation.x += 0.02 * surge;
        innerCore.rotation.z -= 0.018 * surge;

        // Update Orbiting Particles
        const posAttr = orbitGeo.attributes.position as THREE_TYPE.BufferAttribute;
        const posArr = posAttr.array as Float32Array;

        for (let i = 0; i < ORBIT_PARTICLES; i++) {
          const meta = particleMeta[i];
          meta.angle += meta.speed * surge;

          // Pull slightly toward mouse if active
          let r = meta.radius;
          if (mouse.active) {
            r += Math.sin(t * 2 + i) * 0.2;
          }

          posArr[i * 3]     = Math.cos(meta.angle) * r;
          posArr[i * 3 + 1] = Math.sin(meta.angle) * r * Math.sin(meta.tilt) + meta.phi;
          posArr[i * 3 + 2] = Math.sin(meta.angle) * r * Math.cos(meta.tilt);
        }
        posAttr.needsUpdate = true;

        // Connect 6-8 nearest particles to nucleus with laser lines
        const cLineAttr = coreLineGeo.attributes.position as THREE_TYPE.BufferAttribute;
        const cLineArr = cLineAttr.array as Float32Array;
        let cCount = 0;

        for (let i = 0; i < Math.min(MAX_CORE_LINES, ORBIT_PARTICLES); i++) {
          const pIdx = (i * 11) % ORBIT_PARTICLES;
          cLineArr[cCount * 6]     = 0;
          cLineArr[cCount * 6 + 1] = 0;
          cLineArr[cCount * 6 + 2] = 0;
          cLineArr[cCount * 6 + 3] = posArr[pIdx * 3];
          cLineArr[cCount * 6 + 4] = posArr[pIdx * 3 + 1];
          cLineArr[cCount * 6 + 5] = posArr[pIdx * 3 + 2];
          cCount++;
        }
        coreLineGeo.setDrawRange(0, cCount * 2);
        cLineAttr.needsUpdate = true;

        // Dust rotation
        dustMesh.rotation.y = t * 0.02;

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
        pointerEvents: "auto",
        zIndex: 0,
        opacity: 0.9,
      }}
      aria-hidden="true"
    />
  );
}
