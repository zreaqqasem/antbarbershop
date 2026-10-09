import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

export type Part = "guard" | "cutter" | "blade" | "motor" | "body";

// Distance (model units) each part travels along the clipper's axis when exploded.
export const SPREAD: Record<Part, number> = {
  guard: 7.5,
  cutter: 5,
  blade: 3,
  motor: 1.2,
  body: -4.6,
};

// Body cross-sections are ovals: round in profile, flattened front to back.
const OVAL = 0.64;
// Top of the blade teeth in model space; the sweep lines this up with the photo reveal.
export const TIP_Y = 11.3;

function knurlTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  g.fillStyle = "#808080";
  g.fillRect(0, 0, 128, 128);
  g.strokeStyle = "#000";
  g.lineWidth = 10;
  for (let i = -128; i <= 256; i += 32) {
    g.beginPath();
    g.moveTo(i, 0);
    g.lineTo(i + 128, 128);
    g.moveTo(i + 128, 0);
    g.lineTo(i, 128);
    g.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(26, 9);
  return t;
}

function logoTexture() {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 160;
  const g = c.getContext("2d")!;
  const grad = g.createLinearGradient(0, 0, 512, 0);
  grad.addColorStop(0, "#8a6a14");
  grad.addColorStop(0.45, "#f7e3a0");
  grad.addColorStop(1, "#b38a1f");
  g.fillStyle = grad;
  g.font = "600 104px 'Sofia Sans Condensed', 'Arial Narrow', sans-serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.letterSpacing = "18px";
  g.fillText("A&T", 256, 84);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

const lathe = (pts: [number, number][], segs = 128, phiStart = 0, phiLength = Math.PI * 2) => {
  const geo = new THREE.LatheGeometry(
    pts.map(([r, y]) => new THREE.Vector2(r, y)),
    segs,
    phiStart,
    phiLength,
  );
  geo.scale(1, 1, OVAL);
  geo.computeVertexNormals();
  return geo;
};

// Body radius along its length; shared by the shell, grip sleeve, rings and logo.
const PROFILE: [number, number][] = [
  [0, -8.3],
  [0.9, -8.25],
  [1.55, -8.05],
  [1.98, -7.7],
  [2.16, -7.2],
  [2.22, -6.2],
  [2.3, -3.5],
  [2.38, -0.5],
  [2.48, 2.5],
  [2.66, 5.2],
  [2.8, 6.5],
  [2.82, 7],
  [2.7, 7.3],
  [0, 7.35],
];
const radiusAt = (y: number) => {
  for (let i = 1; i < PROFILE.length; i++) {
    const [r0, y0] = PROFILE[i - 1];
    const [r1, y1] = PROFILE[i];
    if (y >= y0 && y <= y1) return r0 + ((y - y0) / (y1 - y0)) * (r1 - r0);
  }
  return 2.4;
};

function buildClipper() {
  const black = new THREE.MeshPhysicalMaterial({
    color: 0x0b0b0d,
    metalness: 0.6,
    roughness: 0.34,
    clearcoat: 1,
    clearcoatRoughness: 0.14,
  });
  const knurl = knurlTexture();
  const grip = new THREE.MeshPhysicalMaterial({
    color: 0x111114,
    metalness: 0.75,
    roughness: 0.42,
    bumpMap: knurl,
    bumpScale: 2.2,
  });
  const gold = new THREE.MeshPhysicalMaterial({ color: 0xd9ad3c, metalness: 1, roughness: 0.2, clearcoat: 0.6 });
  const steel = new THREE.MeshPhysicalMaterial({ color: 0xdfe2e6, metalness: 1, roughness: 0.13 });
  const copper = new THREE.MeshPhysicalMaterial({ color: 0xc06a32, metalness: 1, roughness: 0.28 });
  const rubber = new THREE.MeshPhysicalMaterial({ color: 0x0a0a0b, metalness: 0, roughness: 0.62 });
  const smoke = new THREE.MeshPhysicalMaterial({
    color: 0x050506,
    metalness: 0,
    roughness: 0.35,
    clearcoat: 0.8,
    clearcoatRoughness: 0.3,
    envMapIntensity: 0.35,
    transparent: true,
    opacity: 0.9,
  });

  const parts = {} as Record<Part, THREE.Group>;
  const root = new THREE.Group();
  for (const p of ["body", "motor", "blade", "cutter", "guard"] as Part[]) {
    parts[p] = new THREE.Group();
    root.add(parts[p]);
  }
  const add = (part: Part, geo: THREE.BufferGeometry, mat: THREE.Material, pos?: [number, number, number], rot?: [number, number, number]) => {
    const m = new THREE.Mesh(geo, mat);
    if (pos) m.position.set(...pos);
    if (rot) m.rotation.set(...rot);
    parts[part].add(m);
    return m;
  };
  const teeth = (part: Part, mat: THREE.Material, n: number, width: number, y: number, z: number, size: [number, number, number], tilt = 0) => {
    const geo = new RoundedBoxGeometry(size[0], size[1], size[2], 2, Math.min(size[0], size[2]) / 2.2);
    const inst = new THREE.InstancedMesh(geo, mat, n);
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(tilt, 0, 0));
    for (let i = 0; i < n; i++) {
      const x = -width / 2 + (i * width) / (n - 1);
      inst.setMatrixAt(i, m.compose(new THREE.Vector3(x, y, z), q, new THREE.Vector3(1, 1, 1)));
    }
    parts[part].add(inst);
  };

  // Body shell, knurled grip sleeve, gold trim rings and the head that holds the blades.
  add("body", lathe(PROFILE), black);
  add(
    "body",
    lathe(PROFILE.filter(([, y]) => y >= -6.2 && y <= 1.2).map(([r, y]) => [r + 0.025, y] as [number, number])),
    grip,
  );
  for (const y of [-6.4, 1.6, 6.1]) {
    const r = radiusAt(y);
    const ring = new THREE.TorusGeometry(r + 0.04, 0.085, 20, 160);
    ring.rotateX(Math.PI / 2);
    ring.scale(1, 1, OVAL);
    add("body", ring, gold, [0, y, 0]);
  }
  add("body", new RoundedBoxGeometry(6.1, 1.4, 3.3, 5, 0.42), black, [0, 7.85, 0]);
  add("body", new RoundedBoxGeometry(6.16, 0.16, 3.36, 2, 0.06), gold, [0, 8.5, 0]);

  // Power switch and the engraved logo sit on the front face.
  const frontZ = (y: number) => radiusAt(y) * OVAL;
  add("body", new RoundedBoxGeometry(1.0, 2.1, 0.5, 4, 0.22), black, [0, 3.6, frontZ(3.6) - 0.05]);
  add("body", new RoundedBoxGeometry(0.62, 0.8, 0.3, 3, 0.14), gold, [0, 4.0, frontZ(3.6) + 0.18]);
  const logo = new THREE.MeshPhysicalMaterial({
    map: logoTexture(),
    transparent: true,
    metalness: 1,
    roughness: 0.25,
  });
  add("body", lathe([[2.42, -0.9], [2.47, 0.9]], 64, -0.62, 1.24), logo);

  // Taper lever on the left side of the head.
  add("body", new THREE.CylinderGeometry(0.42, 0.42, 0.5, 32), steel, [-3.1, 7.6, 0.4], [Math.PI / 2, 0, 0]);
  add("body", new RoundedBoxGeometry(0.5, 3.2, 0.36, 3, 0.16), steel, [-3.35, 6.3, 0.4], [0, 0, -0.25]);

  // Cord with a gold strain relief.
  add("body", new THREE.CylinderGeometry(0.62, 0.48, 1.5, 40), gold, [0, -8.9, 0]);
  const cord = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, -9.4, 0),
    new THREE.Vector3(0.1, -11, 0.2),
    new THREE.Vector3(0.9, -13, 0.8),
    new THREE.Vector3(2.6, -14.6, 0.4),
    new THREE.Vector3(4.6, -15.4, -0.6),
  ]);
  add("body", new THREE.TubeGeometry(cord, 80, 0.34, 20), rubber);

  // Motor: copper windings around a steel core; hidden inside the body until it slides away.
  add("motor", new THREE.CylinderGeometry(1.15, 1.15, 3.2, 48), copper, [0, 5.2, 0]);
  for (let i = 0; i < 14; i++) {
    const w = new THREE.TorusGeometry(1.2, 0.07, 10, 64);
    w.rotateX(Math.PI / 2);
    add("motor", w, copper, [0, 3.75 + i * 0.22, 0]);
  }
  add("motor", new THREE.CylinderGeometry(0.32, 0.32, 4.2, 24), steel, [0, 5.2, 0]);
  add("motor", new THREE.CylinderGeometry(1.5, 1.5, 0.22, 48), gold, [0, 3.45, 0]);
  add("motor", new THREE.CylinderGeometry(1.5, 1.5, 0.22, 48), gold, [0, 6.95, 0]);

  // Stationary steel blade with fine teeth.
  add("blade", new RoundedBoxGeometry(6.5, 2.5, 0.26, 3, 0.1), steel, [0, 9.75, 0.15], [-0.08, 0, 0]);
  teeth("blade", steel, 44, 6.3, 11.2, 0.25, [0.1, 0.62, 0.22], -0.08);
  for (const x of [-2.3, 2.3]) {
    add("blade", new THREE.CylinderGeometry(0.2, 0.2, 0.2, 24), steel, [x, 9.3, 0.38], [Math.PI / 2, 0, 0]);
  }

  // Gold moving cutter in front of it.
  add("cutter", new RoundedBoxGeometry(5.5, 1.4, 0.2, 3, 0.08), gold, [0, 9.95, 0.45], [-0.08, 0, 0]);
  teeth("cutter", gold, 34, 5.3, 10.85, 0.5, [0.09, 0.4, 0.16], -0.08);

  // Smoked guard comb that clips over the blades.
  add("guard", new RoundedBoxGeometry(6.9, 0.5, 3.0, 4, 0.22), smoke, [0, 9.0, -0.2]);
  add("guard", new RoundedBoxGeometry(0.3, 3.6, 3.0, 3, 0.14), smoke, [-3.35, 10.6, -0.2]);
  add("guard", new RoundedBoxGeometry(0.3, 3.6, 3.0, 3, 0.14), smoke, [3.35, 10.6, -0.2]);
  teeth("guard", smoke, 19, 6.3, 11.1, 1.0, [0.17, 3.9, 0.42], -0.32);
  add("guard", new RoundedBoxGeometry(6.9, 0.22, 0.6, 2, 0.1), gold, [0, 9.3, 1.25]);

  return { root, parts };
}

export type ClipperScene = ReturnType<typeof createClipperScene>;

export function createClipperScene(canvas: HTMLCanvasElement) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const key = new THREE.DirectionalLight(0xfff1d6, 2.2);
  key.position.set(8, 14, 16);
  const rim = new THREE.DirectionalLight(0xe0b44a, 3.2);
  rim.position.set(-12, 6, -10);
  const fill = new THREE.DirectionalLight(0x9fb4ff, 0.5);
  fill.position.set(-10, -6, 12);
  scene.add(key, rim, fill);

  const camera = new THREE.PerspectiveCamera(28, 1, 1, 200);
  camera.position.set(0, 0, 66);

  const { root, parts } = buildClipper();
  const pivot = new THREE.Group();
  pivot.add(root);
  scene.add(pivot);

  const resize = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();

  // World units per CSS pixel on the z=0 plane, for placing the model against DOM elements.
  const unitsPerPx = () =>
    (2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))) / canvas.clientHeight;

  const v = new THREE.Vector3();
  return {
    pivot,
    parts,
    camera,
    resize,
    unitsPerPx,
    explode(e: number) {
      for (const p of Object.keys(parts) as Part[]) parts[p].position.y = SPREAD[p] * e;
    },
    // Screen position (CSS px within the canvas) of a point in a part's local space.
    project(part: Part, x: number, y: number, z = 0) {
      v.set(x, y, z);
      parts[part].localToWorld(v);
      v.project(camera);
      return { x: (v.x * 0.5 + 0.5) * canvas.clientWidth, y: (-v.y * 0.5 + 0.5) * canvas.clientHeight };
    },
    render() {
      renderer.render(scene, camera);
    },
    dispose() {
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose();
        const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : [];
        mats.forEach((mat) => mat.dispose());
      });
      pmrem.dispose();
      renderer.dispose();
    },
  };
}
