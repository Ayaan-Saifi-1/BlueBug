"use client";
import { useEffect, useRef } from "react";

const VERTEX_SHADER = `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;

  // Simplex-like noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;
    float t = uTime * 0.15;

    // Layered noise
    float n1 = snoise(uv * 3.0 + t);
    float n2 = snoise(uv * 5.0 - t * 0.7);
    float n3 = snoise(uv * 8.0 + t * 0.3);
    float n = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;

    // Mouse influence
    vec2 mouseUV = uMouse / uResolution;
    float mouseDist = length(uv - mouseUV);
    float mouseInfluence = smoothstep(0.4, 0.0, mouseDist) * 0.3;

    // Color mixing — deep blue to cyan to subtle violet
    vec3 col1 = vec3(0.078, 0.506, 0.973); // --bb-blue
    vec3 col2 = vec3(0.055, 0.647, 0.914); // --bb-azure
    vec3 col3 = vec3(0.388, 0.400, 0.945); // violet
    vec3 color = mix(col1, col2, n * 0.5 + 0.5);
    color = mix(color, col3, n3 * 0.3 + mouseInfluence);

    // Vignette
    float vignette = smoothstep(0.8, 0.2, length(uv - 0.5));
    color *= vignette * 0.3;

    gl_FragColor = vec4(color, 1.0);
  }
`;

export function FluidShaderCanvas({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let animId: number;
    let cleanup: (() => void) | undefined;

    async function init() {
      const THREE = await import("three");
      const canvas = canvasRef.current;
      if (!canvas) return;

      const renderer = new THREE.WebGLRenderer({ canvas, alpha: false });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

      const mouse = { x: 0, y: 0 };
      const uniforms = {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(canvas.clientWidth, canvas.clientHeight) },
        uMouse: { value: new THREE.Vector2(0, 0) },
      };

      const geometry = new THREE.PlaneGeometry(2, 2);
      const material = new THREE.ShaderMaterial({
        vertexShader: VERTEX_SHADER,
        fragmentShader: FRAGMENT_SHADER,
        uniforms,
      });
      scene.add(new THREE.Mesh(geometry, material));

      const onResize = () => {
        if (!canvas) return;
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        uniforms.uResolution.value.set(canvas.clientWidth, canvas.clientHeight);
      };

      const onMouse = (e: MouseEvent) => {
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = canvas.clientHeight - (e.clientY - rect.top);
      };

      window.addEventListener("resize", onResize);
      canvas.addEventListener("mousemove", onMouse);

      const clock = new THREE.Clock();
      function animate() {
        uniforms.uTime.value = clock.getElapsedTime();
        uniforms.uMouse.value.set(mouse.x, mouse.y);
        renderer.render(scene, camera);
        animId = requestAnimationFrame(animate);
      }
      animate();

      cleanup = () => {
        cancelAnimationFrame(animId);
        window.removeEventListener("resize", onResize);
        canvas.removeEventListener("mousemove", onMouse);
        renderer.dispose();
        geometry.dispose();
        material.dispose();
      };
    }

    init();
    return () => cleanup?.();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`fluid-shader-canvas ${className}`}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
