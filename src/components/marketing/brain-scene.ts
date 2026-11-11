import {
  ACESFilmicToneMapping, AmbientLight, Color, DirectionalLight, Group, MathUtils, Mesh,
  MeshPhysicalMaterial, PerspectiveCamera, PointLight, Raycaster, Scene, Vector2, Vector3, WebGLRenderer,
} from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { brainSources, type BrainSourceId } from "./brain-content";

export type BrainActivity = {
  hovered: BrainSourceId | null;
  focused: BrainSourceId | null;
  selected: BrainSourceId | null;
  demo: readonly BrainSourceId[];
};

const settings = {
  model: `${(process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "")}/marketing/brain/company-brain.glb`,
  neutral: { x: .23, y: -.28, z: .04 },
  hover: { x: MathUtils.degToRad(10), y: MathUtils.degToRad(18) },
  drag: { x: .46, y: .96 },
  damping: 6,
  shell: "#284979",
  hindbrain: "#355b94",
  interior: "#1c3252",
  rim: "#a1c8fa",
};

function material(color: string, shell: boolean, compact: boolean) {
  const surface = new MeshPhysicalMaterial({
    color,
    roughness: shell ? .38 : .44,
    metalness: .10,
    clearcoat: compact ? .26 : .65,
    clearcoatRoughness: .32,
    transmission: shell && !compact ? .16 : 0,
    thickness: .30,
    ior: 1.36,
    attenuationColor: "#476f9e",
    attenuationDistance: 1.2,
  });
  surface.onBeforeCompile = shader => {
    shader.uniforms.brainRim = { value: new Color(settings.rim).multiplyScalar(shell ? .55 : .26) };
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", "#include <common>\nuniform vec3 brainRim;")
      .replace("#include <emissivemap_fragment>", `#include <emissivemap_fragment>
        float rim = pow(1.0 - abs(dot(normal, normalize(vViewPosition))), 3.5);
        totalEmissiveRadiance += rim * brainRim;`);
  };
  return surface;
}

function disposeModel(group: Group) {
  group.traverse(node => {
    if (!(node instanceof Mesh)) return;
    node.geometry.dispose();
    const materials = Array.isArray(node.material) ? node.material : [node.material];
    materials.forEach(material => material.dispose());
  });
}

function makeLinks(stage: HTMLElement, viewport: HTMLElement) {
  const svg = stage.querySelector("svg[data-brain-connections]");
  const links = brainSources.slice(0, 4).flatMap(source => {
    const card = stage.querySelector<HTMLElement>(`[data-source="${source.id}"]`);
    const group = svg?.querySelector(`[data-connection="${source.id}"]`);
    if (!card || !group) return [];
    return [{
      id: source.id, card, group, start: new Vector2(), left: source.x < 50, flowing: false,
      path: group.querySelector("path"), dot: group.querySelector("[data-terminal]"),
      signal: group.querySelector("[data-signal]"),
    }];
  });
  const frame = { x: 0, y: 0, width: 0, height: 0 };

  function measure() {
    const bounds = stage.getBoundingClientRect();
    const rect = viewport.getBoundingClientRect();
    frame.x = rect.left - bounds.left;
    frame.y = rect.top - bounds.top;
    frame.width = rect.width;
    frame.height = rect.height;
    svg?.setAttribute("viewBox", `0 0 ${bounds.width} ${bounds.height}`);
    for (const link of links) {
      const box = link.card.getBoundingClientRect();
      link.start.set((link.left ? box.right : box.left) - bounds.left, box.top + box.height / 2 - bounds.top);
    }
  }

  function draw(points: Map<BrainSourceId, Vector3>, flow: readonly BrainSourceId[], progress: number) {
    for (const link of links) {
      const point = points.get(link.id);
      if (!point) continue;
      const x = frame.x + (point.x + 1) * .5 * frame.width;
      const y = frame.y + (1 - point.y) * .5 * frame.height;
      const { x: sx, y: sy } = link.start;
      const mid = sx + (x - sx) * .52;
      link.path?.setAttribute("d", `M${sx} ${sy} C${mid} ${sy} ${mid} ${y} ${x} ${y}`);
      link.dot?.setAttribute("cx", String(x));
      link.dot?.setAttribute("cy", String(y));
      const moving = flow.includes(link.id) && progress < 1;
      if (link.flowing !== moving) {
        link.flowing = moving;
        link.card.toggleAttribute("data-flowing", moving);
        link.group.toggleAttribute("data-flowing", moving);
      }
      link.signal?.setAttribute("opacity", moving ? String(Math.min(1, progress * 7) * (1 - progress ** 8)) : "0");
      if (!moving) continue;
      const t = progress;
      const u = 1 - t;
      link.signal?.setAttribute("cx", String(u ** 3 * sx + 3 * u * t * mid + t ** 3 * x));
      link.signal?.setAttribute("cy", String((u ** 3 + 3 * u ** 2 * t) * sy + (3 * u * t ** 2 + t ** 3) * y));
    }
  }
  function clear() {
    for (const link of links) {
      link.card.removeAttribute("data-flowing");
      link.group.removeAttribute("data-flowing");
      link.flowing = false;
      link.signal?.setAttribute("opacity", "0");
    }
  }
  return { measure, draw, clear };
}

export async function mountBrainScene({
  canvas, stage, viewport, activity, scrollPose, signal, onReady, onFailure,
}: {
  canvas: HTMLCanvasElement;
  stage: HTMLElement;
  viewport: HTMLElement;
  activity: () => BrainActivity;
  scrollPose: () => number;
  signal: AbortSignal;
  onReady: () => void;
  onFailure: () => void;
}) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mobileLayout = window.matchMedia("(max-width: 600px)");
  const mobileScroll = window.matchMedia("(max-width: 760px)");
  const coarse = window.matchMedia("(pointer: coarse)");
  const compact = coarse.matches || mobileLayout.matches;
  const context = canvas.getContext("webgl2", {
    alpha: true, antialias: window.devicePixelRatio < 1.6, powerPreference: "low-power",
  });
  if (!context || signal.aborted) throw new Error("WebGL is unavailable");

  const renderer = new WebGLRenderer({ canvas, context, alpha: true });
  renderer.setClearColor(0, 0);
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.transmissionResolutionScale = .55;

  const scene = new Scene();
  const camera = new PerspectiveCamera(34, 1, .1, 35);
  const pivot = new Group();
  scene.add(pivot, new AmbientLight("#e7edf5", 1.03));

  const key = new DirectionalLight("#fff9ef", 2.35);
  key.position.set(-3.5, 5, 4.2);
  const rim = new DirectionalLight("#a5c9ff", 2.9);
  rim.position.set(4, 2, -3);
  const fill = new DirectionalLight("#9bb8dd", .85);
  fill.position.set(0, -4, 3);
  const hotspot = new PointLight("#bfd9ff", 0, 1.15, 1.6);
  scene.add(key, rim, fill, hotspot);

  let model: Group | undefined;
  let frame = 0;
  let stopped = false;
  const events = new AbortController();
  const listeners = { signal: events.signal };
  const links = makeLinks(stage, viewport);
  const anchors = new Map<BrainSourceId, Vector3>();
  const points = new Map<BrainSourceId, Vector3>();
  const point = new Vector3();
  const raycaster = new Raycaster();
  const ndc = new Vector2();
  const pointer = new Vector2();
  const target = new Vector2();
  const rotation = new Vector2();
  const keyboard = new Vector2();
  let drag: { id: number; x: number; y: number; engaged: boolean; dx: number; dy: number; stamp: number } | null = null;
  let releaseAt = 0;
  let hovering = false;
  let visible = false;
  let lastFrame = 0;
  let clock = 0;
  let flowStart = -Infinity;
  let nextIdle = 5;
  let idleIndex = 0;
  let flow: readonly BrainSourceId[] = [];
  let lastActivity = "";
  let ready = false;

  function fit() {
    const width = Math.max(1, viewport.clientWidth);
    const height = Math.max(1, viewport.clientHeight);
    camera.aspect = width / height;
    camera.position.z = Math.max(4.55 / camera.aspect, 4.02) / (2 * Math.tan(MathUtils.degToRad(camera.fov / 2)));
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
    const dpr = Math.min(window.devicePixelRatio || 1, coarse.matches || mobileLayout.matches ? 1.25 : 1.65);
    if (renderer.getPixelRatio() !== dpr) renderer.setPixelRatio(dpr);
    renderer.setSize(width, height, false);
    links.measure();
  }

  function draw(delta: number) {
    const still = reduced.matches;
    if (!still) clock += delta;
    if (releaseAt && performance.now() >= releaseAt) {
      releaseAt = 0;
      target.set(0, 0);
    }
    if (!drag && !releaseAt && hovering) target.copy(pointer);
    const smoothing = still ? 1 : 1 - Math.exp(-settings.damping * delta);
    rotation.lerp(keyboard.lengthSq() > 0 ? keyboard : target, smoothing);
    const wave = still ? 0 : Math.sin(clock * Math.PI / 3.2);
    const scroll = !still && mobileScroll.matches ? scrollPose() : 0;
    pivot.position.y = wave * .033 + scroll * .24;
    pivot.rotation.set(settings.neutral.x + rotation.x, settings.neutral.y + rotation.y + scroll * .22, settings.neutral.z);
    const scale = 1 + wave * .006 + (still ? 0 : Math.min(1, rotation.length() * 4) * .025);
    pivot.scale.setScalar(scale);
    pivot.updateMatrixWorld(true);
    key.position.set(-3.5 + rotation.y * 6, 5 - rotation.x * 5 + wave * .14, 4.2);

    const state = activity();
    const active = state.hovered ?? state.focused;
    const emphasized = active ? [active] : state.demo.length ? state.demo : state.selected ? [state.selected] : [];
    const signature = emphasized.join(",");
    if (signature !== lastActivity) {
      lastActivity = signature;
      flow = emphasized;
      flowStart = clock;
      nextIdle = clock + 7;
    } else if (!emphasized.length && !still && clock > nextIdle) {
      flow = [brainSources[idleIndex % 4].id];
      idleIndex++;
      flowStart = clock;
      nextIdle = clock + 8;
    }
    const progress = still ? 1 : Math.min(1, (clock - flowStart) / 1.85);
    const region = anchors.get(emphasized[0] ?? flow[0]);
    if (region) pivot.localToWorld(hotspot.position.copy(region)).z += .27;
    const arrival = !still && region ? Math.max(0, 1 - Math.abs(clock - flowStart - 1.85) * 1.65) : 0;
    hotspot.intensity = (emphasized.length ? .26 : 0) + arrival * .65;

    if (!mobileLayout.matches) {
      for (const [id, anchor] of anchors) {
        const projected = points.get(id);
        if (projected) projected.copy(pivot.localToWorld(point.copy(anchor))).project(camera);
      }
      links.draw(points, flow, progress);
    }
    renderer.render(scene, camera);
  }

  function loop(now: number) {
    frame = 0;
    if (stopped || !ready || !visible || document.hidden) return;
    if (!reduced.matches && compact && lastFrame && now - lastFrame < 31) {
      frame = requestAnimationFrame(loop);
      return;
    }
    draw(lastFrame ? Math.min((now - lastFrame) / 1000, .15) : 0);
    lastFrame = now;
    if (!reduced.matches) frame = requestAnimationFrame(loop);
  }

  function wake() {
    if (!frame && ready && visible && !document.hidden && !stopped) {
      lastFrame = 0;
      frame = requestAnimationFrame(loop);
    }
  }

  function visibility() {
    if (!visible || document.hidden) {
      cancelAnimationFrame(frame);
      frame = 0;
    } else wake();
  }

  function resetView() {
    hovering = false;
    target.set(0, 0);
    keyboard.set(0, 0);
    releaseAt = 0;
    wake();
  }

  function endDrag(event: PointerEvent) {
    if (drag?.id !== event.pointerId) return;
    if (drag.engaged) {
      const inertia = event.type === "pointerup" && performance.now() - drag.stamp < 95;
      target.set(
        MathUtils.clamp(target.x + (inertia ? drag.dy * .004 : 0), -settings.drag.x, settings.drag.x),
        MathUtils.clamp(target.y + (inertia ? drag.dx * .004 : 0), -settings.drag.y, settings.drag.y),
      );
      releaseAt = performance.now() + 560;
    }
    drag = null;
    delete viewport.dataset.dragging;
    if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
  }

  viewport.addEventListener("pointerdown", event => {
    if (reduced.matches || !event.isPrimary || event.button !== 0) return;
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, engaged: false, dx: 0, dy: 0, stamp: performance.now() };
    if (event.pointerType === "mouse") viewport.setPointerCapture(event.pointerId);
  }, listeners);
  viewport.addEventListener("pointermove", event => {
    if (reduced.matches || !event.isPrimary) return;
    if (drag?.id === event.pointerId) {
      const dx = event.clientX - drag.x;
      const dy = event.clientY - drag.y;
      if (!drag.engaged) {
        if (event.pointerType === "touch" && Math.abs(dy) > 9 && Math.abs(dy) >= Math.abs(dx)) { drag = null; return; }
        if (Math.hypot(dx, dy) < 7) return;
        drag.engaged = true;
        hovering = false;
        releaseAt = 0;
        keyboard.set(0, 0);
        viewport.dataset.dragging = "true";
        viewport.setPointerCapture(event.pointerId);
      }
      target.set(
        MathUtils.clamp(target.x + dy * .008, -settings.drag.x, settings.drag.x),
        MathUtils.clamp(target.y + dx * .009, -settings.drag.y, settings.drag.y),
      );
      Object.assign(drag, { x: event.clientX, y: event.clientY, dx, dy, stamp: performance.now() });
    } else if (event.pointerType === "mouse") {
      const rect = viewport.getBoundingClientRect();
      hovering = true;
      keyboard.set(0, 0);
      pointer.set(
        (2 * (event.clientY - rect.top) / rect.height - 1) * settings.hover.x,
        (2 * (event.clientX - rect.left) / rect.width - 1) * settings.hover.y,
      );
    }
  }, listeners);
  for (const event of ["pointerup", "pointercancel", "lostpointercapture"] as const) {
    viewport.addEventListener(event, endDrag, listeners);
  }
  viewport.addEventListener("pointerleave", () => {
    hovering = false;
    if (!drag) {
      releaseAt = 0;
      target.set(0, 0);
    }
  }, listeners);
  viewport.addEventListener("keydown", event => {
    if (event.key === "Escape") { resetView(); return; }
    const step = .13;
    const keys: Record<string, [number, number]> = { ArrowUp: [-step, 0], ArrowDown: [step, 0], ArrowLeft: [0, -step], ArrowRight: [0, step] };
    const offset = keys[event.key];
    if (!offset) return;
    event.preventDefault();
    hovering = false;
    target.set(0, 0);
    releaseAt = 0;
    keyboard.set(
      MathUtils.clamp(keyboard.x + offset[0], -settings.drag.x, settings.drag.x),
      MathUtils.clamp(keyboard.y + offset[1], -settings.drag.y, settings.drag.y),
    );
    wake();
  }, listeners);
  viewport.addEventListener("blur", resetView, listeners);
  reduced.addEventListener("change", () => {
    if (drag) {
      const pointerId = drag.id;
      drag = null;
      delete viewport.dataset.dragging;
      if (viewport.hasPointerCapture(pointerId)) viewport.releasePointerCapture(pointerId);
    }
    resetView();
  }, listeners);
  document.addEventListener("visibilitychange", visibility, listeners);
  // The HTML and canvas have separate lifecycles. The HTML wakes an otherwise
  // static reduced-motion canvas when a source changes.
  stage.addEventListener("brain-activity", wake, listeners);

  const intersection = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    visibility();
  });
  const resize = new ResizeObserver(() => { fit(); wake(); });
  intersection.observe(viewport);
  resize.observe(viewport);

  function dispose() {
    if (stopped) return;
    stopped = true;
    signal.removeEventListener("abort", dispose);
    events.abort();
    intersection.disconnect();
    resize.disconnect();
    cancelAnimationFrame(frame);
    links.clear();
    if (model) disposeModel(model);
    renderer.dispose();
    if (!renderer.getContext().isContextLost()) renderer.forceContextLoss();
  }
  signal.addEventListener("abort", dispose, { once: true });
  canvas.addEventListener("webglcontextlost", event => {
    event.preventDefault();
    dispose();
    onFailure();
  }, listeners);

  try {
    const response = await fetch(settings.model, { signal });
    if (!response.ok) throw new Error("Brain model failed to load");
    const gltf = await new GLTFLoader().parseAsync(await response.arrayBuffer(), "");
    if (stopped) { disposeModel(gltf.scene); return; }
    model = gltf.scene;
    const shell = material(settings.shell, true, compact);
    const hindbrain = material(settings.hindbrain, false, compact);
    const interior = material(settings.interior, false, compact);
    // Keep the optical shell and inner structures in distinct render passes.
    model.traverse(node => {
      if (!(node instanceof Mesh)) return;
      node.material.dispose();
      node.material = node.name === "Cortex" ? shell : node.name === "Hindbrain" ? hindbrain : interior;
    });
    pivot.add(model);
    fit();
    pivot.rotation.set(settings.neutral.x, settings.neutral.y, settings.neutral.z);
    pivot.updateMatrixWorld(true);
    for (const source of brainSources) {
      const [x, y] = source.anchor;
      // Locate an actual surface point from the neutral view and retain it in
      // the rotating model's local coordinates.
      let hit;
      for (const inset of [1, .82, .6, .3]) {
        raycaster.setFromCamera(ndc.set(x * inset, y * inset), camera);
        hit = raycaster.intersectObject(model, true)[0];
        if (hit) break;
      }
      if (!hit) continue;
      anchors.set(source.id, pivot.worldToLocal(hit.point));
      points.set(source.id, new Vector3());
    }
    ready = true;
    draw(0);
    onReady();
    wake();
  } catch (error) {
    dispose();
    throw error;
  }
}
