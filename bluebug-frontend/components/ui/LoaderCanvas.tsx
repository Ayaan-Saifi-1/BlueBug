"use client";
import { useEffect, useRef } from "react";
import type * as THREE_TYPE from "three";

interface LoaderCanvasProps {
  progress: number;
  stage: "boot" | "scan" | "energize" | "dock" | "done";
}

export function LoaderCanvas({ progress, stage }: LoaderCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef(stage);
  const progressRef = useRef(progress);

  stageRef.current = stage;
  progressRef.current = progress;

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

      const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

      // 3D Assembly Vortex Core Group
      const coreGroup = new THREE.Group();
      scene.add(coreGroup);

      // Responsive camera distance and revolution radius scaling for mobile
      const updateCamera = () => {
        if (!canvas) return;
        const aspect = canvas.clientWidth / canvas.clientHeight;
        camera.aspect = aspect;
        if (aspect < 1) {
          // Portrait phone: decrease the revolution radius proportionally so all orbiting particles and rings stay safely within the phone screen
          const mobScale = Math.min(0.48, Math.max(0.36, aspect * 1.02));
          coreGroup.scale.set(mobScale, mobScale, mobScale);
          camera.position.z = 10;
        } else {
          // Laptop: perfect 1.0 scale and Z=10 distance (user: "the laptop version is perfect")
          coreGroup.scale.set(1, 1, 1);
          camera.position.z = 10;
        }
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
      };
      updateCamera();

      // Create Particle Texture
      const spriteCanvas = document.createElement("canvas");
      spriteCanvas.width = 32;
      spriteCanvas.height = 32;
      const sCtx = spriteCanvas.getContext("2d");
      if (sCtx) {
        const grad = sCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
        grad.addColorStop(0, "rgba(255, 255, 255, 1)");
        grad.addColorStop(0.25, "rgba(56, 189, 248, 0.95)");
        grad.addColorStop(0.7, "rgba(20, 129, 248, 0.3)");
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");
        sCtx.fillStyle = grad;
        sCtx.fillRect(0, 0, 32, 32);
      }
      const pTexture = new THREE.CanvasTexture(spriteCanvas);

      // 1. Swarming Inward/Outward Assembly Particles
      const SWARM_COUNT = 180;
      const swarmPositions = new Float32Array(SWARM_COUNT * 3);
      const swarmColors = new Float32Array(SWARM_COUNT * 3);
      const swarmMeta: Array<{
        targetR: number;
        angle: number;
        speed: number;
        yOffset: number;
        r: number;
        burstVx: number;
        burstVy: number;
        burstVz: number;
      }> = [];

      for (let i = 0; i < SWARM_COUNT; i++) {
        const startR = 4.0 + Math.random() * 4.5;
        const targetR = 1.3 + Math.random() * 1.7;
        const angle = Math.random() * Math.PI * 2;
        const speed = (0.015 + Math.random() * 0.025) * (Math.random() > 0.5 ? 1 : -1);
        const yOffset = (Math.random() - 0.5) * 3.2;

        swarmMeta.push({
          targetR,
          angle,
          speed,
          yOffset,
          r: startR,
          burstVx: (Math.random() - 0.5) * 0.32,
          burstVy: (Math.random() - 0.5) * 0.32,
          burstVz: (Math.random() - 0.5) * 0.32,
        });

        swarmPositions[i * 3]     = Math.cos(angle) * startR;
        swarmPositions[i * 3 + 1] = yOffset;
        swarmPositions[i * 3 + 2] = Math.sin(angle) * startR;

        swarmColors[i * 3]     = 0.22;
        swarmColors[i * 3 + 1] = 0.74;
        swarmColors[i * 3 + 2] = 0.97;
      }

      const swarmGeo = new THREE.BufferGeometry();
      swarmGeo.setAttribute("position", new THREE.BufferAttribute(swarmPositions, 3));
      swarmGeo.setAttribute("color", new THREE.BufferAttribute(swarmColors, 3));

      const swarmMat = new THREE.PointsMaterial({
        size: 0.22,
        map: pTexture,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const swarmMesh = new THREE.Points(swarmGeo, swarmMat);
      coreGroup.add(swarmMesh);

      // 2. Dual Wireframe Quantum Rings around the central core
      const ring1Geo = new THREE.TorusGeometry(2.35, 0.018, 16, 72);
      const ring1Mat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.35 });
      const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
      coreGroup.add(ring1);

      const ring2Geo = new THREE.TorusGeometry(1.85, 0.015, 16, 64);
      const ring2Mat = new THREE.MeshBasicMaterial({ color: 0x1481F8, transparent: true, opacity: 0.45 });
      const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
      ring2.rotation.x = Math.PI * 0.38;
      ring2.rotation.y = Math.PI * 0.25;
      coreGroup.add(ring2);

      // 3. Connecting Laser Web Lines between inner swarm and core
      const MAX_LINES = 40;
      const linePos = new Float32Array(MAX_LINES * 6);
      const lineGeo = new THREE.BufferGeometry();
      lineGeo.setAttribute("position", new THREE.BufferAttribute(linePos, 3));
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
      });
      const laserWeb = new THREE.LineSegments(lineGeo, lineMat);
      coreGroup.add(laserWeb);

      // Mouse and Touch Listeners for seamless mobile interactivity
      const onMouseMove = (e: MouseEvent) => {
        mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
      };

      const onTouchMove = (e: TouchEvent) => {
        if (e.touches.length > 0) {
          const touch = e.touches[0];
          mouse.targetX = (touch.clientX / window.innerWidth) * 2 - 1;
          mouse.targetY = -(touch.clientY / window.innerHeight) * 2 + 1;
        }
      };

      const onTouchStart = (e: TouchEvent) => {
        if (e.touches.length > 0) {
          const touch = e.touches[0];
          mouse.targetX = (touch.clientX / window.innerWidth) * 2 - 1;
          mouse.targetY = -(touch.clientY / window.innerHeight) * 2 + 1;
        }
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("touchmove", onTouchMove, { passive: true });
      window.addEventListener("touchstart", onTouchStart, { passive: true });
      window.addEventListener("resize", updateCamera);

      let t = 0;
      let hasBurst = false;

      function animate() {
        animId = requestAnimationFrame(animate);
        t += 0.02;

        mouse.x += (mouse.targetX - mouse.x) * 0.06;
        mouse.y += (mouse.targetY - mouse.y) * 0.06;

        // Subtle interactive 3D parallax tracking finger/mouse without drifting origin
        coreGroup.rotation.x = mouse.y * 0.15;
        coreGroup.rotation.y = mouse.x * 0.22;

        // Ring rotations
        ring1.rotation.z += 0.008;
        ring2.rotation.z -= 0.012;

        const curStage = stageRef.current;
        const curProg = progressRef.current / 100; // 0 to 1

        const sPosArr = swarmGeo.attributes.position.array as Float32Array;
        const lPosArr = lineGeo.attributes.position.array as Float32Array;
        let lineIdx = 0;

        if (curStage === "energize" && !hasBurst) {
          hasBurst = true;
        }

        for (let i = 0; i < SWARM_COUNT; i++) {
          const meta = swarmMeta[i];
          const ix = i * 3;

          if (curStage === "energize" || curStage === "dock") {
            // Hyper-drive outward explosion
            sPosArr[ix]     += meta.burstVx * 1.5;
            sPosArr[ix + 1] += meta.burstVy * 1.5;
            sPosArr[ix + 2] += meta.burstVz * 1.5;
          } else {
            // Swarm convergence as progress increases from 0% to 100%
            const targetRadius = meta.targetR + (1 - curProg) * 2.2;
            meta.r += (targetRadius - meta.r) * 0.05;
            meta.angle += meta.speed * (1 + curProg * 1.5);

            const px = Math.cos(meta.angle) * meta.r;
            const py = meta.yOffset * (1 - curProg * 0.3) + Math.sin(t * 3 + i) * 0.15;
            const pz = Math.sin(meta.angle) * meta.r;

            sPosArr[ix]     = px;
            sPosArr[ix + 1] = py;
            sPosArr[ix + 2] = pz;

            // Connect nearest nodes to center
            if (lineIdx < MAX_LINES && i % 4 === 0) {
              lPosArr[lineIdx * 6]     = 0;
              lPosArr[lineIdx * 6 + 1] = 0;
              lPosArr[lineIdx * 6 + 2] = 0;
              lPosArr[lineIdx * 6 + 3] = px;
              lPosArr[lineIdx * 6 + 4] = py;
              lPosArr[lineIdx * 6 + 5] = pz;
              lineIdx++;
            }
          }
        }

        swarmGeo.attributes.position.needsUpdate = true;
        lineGeo.setDrawRange(0, lineIdx * 2);
        lineGeo.attributes.position.needsUpdate = true;

        // Scaling effect
        if (curStage === "dock") {
          swarmMat.opacity = Math.max(0, swarmMat.opacity - 0.04);
          ring1Mat.opacity = Math.max(0, ring1Mat.opacity - 0.04);
          ring2Mat.opacity = Math.max(0, ring2Mat.opacity - 0.04);
        }

        renderer.render(scene, camera);
      }
      animate();

      cleanup = () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("touchmove", onTouchMove);
        window.removeEventListener("touchstart", onTouchStart);
        window.removeEventListener("resize", updateCamera);
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
        zIndex: 1,
      }}
      aria-hidden="true"
    />
  );
}
