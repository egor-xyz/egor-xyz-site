import { Html, useGLTF } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { motion, useReducedMotion } from 'motion/react';
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMacbookStore } from 'src/store/macbookStore';
import { type A, a } from 'src/utils/a';
import {
  BackSide,
  BoxGeometry,
  type Group,
  type Light,
  Mesh,
  MeshBasicMaterial,
  type MeshStandardMaterial,
  PlaneGeometry,
  PMREMGenerator,
  Scene,
  Vector3
} from 'three';
import type { GLTF } from 'three-stdlib';
import { ScreenMenu } from './ScreenMenu';

type GLTFResult = GLTF & {
  materials: {
    Acrylic_Clear: MeshStandardMaterial;
    'Aluminum_-_Anodized_Glossy_Grey': MeshStandardMaterial;
    'Aluminum_-_Anodized_Glossy_Grey_keyboard.jpg': MeshStandardMaterial;
    'Bronze_-_Polished': MeshStandardMaterial;
    'Glass_-_Heavy_Color': MeshStandardMaterial;
    'Plastic_-_Translucent_Matte_Gray': MeshStandardMaterial;
    'Rubber_-_Soft': MeshStandardMaterial;
    'Steel_-_Satin': MeshStandardMaterial;
  };
  nodes: {
    Object_10: Mesh;
    Object_12: Mesh;
    Object_14: Mesh;
    Object_16: Mesh;
    Object_18: Mesh;
    Object_20: Mesh;
    Object_6: Mesh;
    Object_8: Mesh;
  };
};

// --- Intro timeline (seconds) -----------------------------------------------
const ENTRANCE_DUR = 1.4; // closed laptop flies in from deep space
const OPEN_DELAY = 0.15; // brief pause after it arrives
const OPEN_DUR = 0.9; // lid swings open
const FOCUS_DELAY = 0.15; // pause before zooming in
const FOCUS_DUR = 0.9; // camera dollies in until the screen ~fills the view
const OPEN_START = ENTRANCE_DUR + OPEN_DELAY;
const FOCUS_START = OPEN_START + OPEN_DUR + FOCUS_DELAY;

// --- Camera framing ---------------------------------------------------------
// Open: dolly close to the screen (~80%). Closed: a 3/4 top view of the lid.
const NEAR_DIST = 2.12; // open framing — screen ~80%, keyboard just peeks in
const NEAR_TARGET_DROP = 0.16; // look a touch below screen centre → keyboard peeks in
const CLOSED_CAM = new Vector3(1.3, 3.0, 3.0); // 3/4 look-down on the closed lid (Apple logo)
const CLOSED_LOOK = new Vector3(0, 0.1, 0);

const _screen = new Vector3();
const _pos = new Vector3();
const _closed = new Vector3();
const _target = new Vector3();

// --- Geometry (model local space) -------------------------------------------
const HINGE_Y = 1.08;
const HINGE_Z = -0.03; // pivot on the deck's key surface → closed lid rests flush on it
const LID_STRETCH = 1.03; // lengthen the lid so its closed front edge meets the base (no step)
const LID_CLOSED = Math.PI / 2; // exactly 90° → lid parallel to the deck (flush, no clip)
const LID_OPEN = -0.18; // tilt the screen back a touch when open
const SCREEN_CENTER: [number, number, number] = [0, 1.09, 1.05];

const TILT_X = -Math.PI / 2; // lays it open (deck flat, lid up)
const SPIN_Y = 0; // screen faces the camera
const HTML_ROT: [number, number, number] = [Math.PI / 2, 0, 0];

// Reveal rotation during the fly-in: tip the closed laptop so the Apple logo
// faces the camera, then settle to the upright front view.
const INTRO_TILT_X = -1.15;
const INTRO_SPIN_Y = 0.8;
const REVEAL_DUR = ENTRANCE_DUR + OPEN_DELAY;

// Exit transition: close the lid and fly at the user, then route.
const EXIT_DUR = 0.62;
const EXIT_FLY_Z = 4;
const EXIT_SCALE = 2.4;

const DRAG_THRESHOLD = 6; // px of movement before a press counts as a drag

// The model is parked at its fly-in start pose and rendered until the frame rate
// proves the expensive first frames (shader compile, texture upload, PMREM) are
// paid for: SETTLED_FRAMES consecutive frames under SETTLED_FRAME_MS. WARMUP_CAP
// keeps a slow device from waiting forever.
const SETTLED_FRAMES = 2;
const SETTLED_FRAME_MS = 32;
const WARMUP_CAP_MS = 1200;
const WARMUP_HOLD_MS = 120; // small beat after warm-up so the fly-in reads as deliberate
// Never let a stalled frame advance the timeline by more than this — one hitch
// must not teleport an animation forward.
const MAX_DELTA = 1 / 30;

// Responsive laptop size, driven by the STABLE canvas pixel width — NOT r3f's
// viewport.width, which is in world units and shrinks as the camera dollies in.
// (A re-render re-reading viewport.width at the menu reveal collapsed the scale,
// making the laptop visibly shrink. size.width only changes on resize.)
const SCALE_REF_WIDTH = 1300; // canvas px at which the laptop reaches its max scale
const REST_SCALE_MIN = 0.55;
const REST_SCALE_MAX = 0.78;

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;
const easeOutBack = (t: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2;
};
const easeInOut = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);
const easeInCubic = (t: number) => t ** 3;

type DragRot = { pitch: number; yaw: number };

// Reflections. drei's <Environment preset> streams a 1.5 MB HDR from a
// third-party CDN (raw.githack.com) — on a cold load that cost ~1.6 s of
// network plus an RGBE decode, and the laptop could not draw until it landed.
// This builds the environment locally instead: a dark room with a few big, soft
// light panels. Big and soft matters — three's RoomEnvironment has small bright
// emitters that the glossy screen glass turns into a blown-out white blob.
// The two framings want opposite things: closed, the laptop is a dark slab on
// black space and needs light; open, the camera is inches from a glossy screen
// and the same rig blows out. So the rig is driven by `focus` (0 = closed/wide,
// 1 = open/near) rather than being a single compromise.
const ENV_INTENSITY_CLOSED = 1.3;
const ENV_INTENSITY_OPEN = 0.4;
const AMBIENT_CLOSED = 0.8;
const AMBIENT_OPEN = 0.45;
const CAM_FILL_CLOSED = 0.7;
const CAM_FILL_OPEN = 0.1;
const ENV_BLUR = 0.08; // PMREM sigma — softens panel edges (above ~0.1 three clips the kernel)
const ROOM_TINT = 0x7c8598; // ambient bounce — this is what stops the dark lid reading as a black hole
const PANELS: {
  color: number;
  pos: [number, number, number];
  rot: [number, number, number];
  size: [number, number];
}[] = [
  // Broad overhead key — the gradient that runs down the lid.
  { color: 0xc9d2e0, pos: [0, 9, 2], rot: [-Math.PI / 2, 0, 0], size: [26, 26] },
  // Front fill — lifts the lid and deck toward the camera.
  { color: 0xc2cad8, pos: [0, 2, 12], rot: [0, 0, 0], size: [22, 14] },
  // Side wraps — edge highlights along the aluminium.
  { color: 0xa2abbb, pos: [-11, 3, 2], rot: [0, Math.PI / 2, 0], size: [18, 12] },
  { color: 0x8f97a6, pos: [11, 3, 2], rot: [0, -Math.PI / 2, 0], size: [18, 12] }
];

function buildStudioScene() {
  const scene = new Scene();

  const shell = new Mesh(new BoxGeometry(40, 30, 40), new MeshBasicMaterial({ color: ROOM_TINT, side: BackSide }));
  scene.add(shell);

  for (const panel of PANELS) {
    const mesh = new Mesh(new PlaneGeometry(...panel.size), new MeshBasicMaterial({ color: panel.color }));
    mesh.position.set(...panel.pos);
    mesh.rotation.set(...panel.rot);
    scene.add(mesh);
  }

  return scene;
}

function StudioEnvironment() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);

  useEffect(() => {
    const pmrem = new PMREMGenerator(gl);
    const room = buildStudioScene();
    const env = pmrem.fromScene(room, ENV_BLUR);

    scene.environment = env.texture;
    scene.environmentIntensity = ENV_INTENSITY_CLOSED; // the frame loop takes over from here

    pmrem.dispose();
    room.traverse((node) => {
      const mesh = node as Mesh;
      mesh.geometry?.dispose();
      if (Array.isArray(mesh.material)) mesh.material.forEach((m) => m.dispose());
      else mesh.material?.dispose();
    });

    return () => {
      scene.environment = null;
      env.dispose();
    };
  }, [gl, scene]);

  return null;
}

type ModelProps = {
  drag: React.RefObject<DragRot>;
  mode: 'open' | 'closed';
  navigate: (href: string) => void;
  onClickModel: () => void;
  onReady: () => void;
  portal: React.RefObject<HTMLDivElement>;
  skipIntro: boolean;
  zoom: React.RefObject<number>;
};

function MacbookModel({ drag, mode, navigate, onClickModel, onReady, portal, skipIntro, zoom }: ModelProps) {
  const { nodes, materials } = useGLTF('/macbook/macbook.gltf') as unknown as GLTFResult;
  const { size } = useThree();

  // The display texture is a screenshot. Keep it readable under every light rig.
  const displayMaterial = useMemo(
    () =>
      new MeshBasicMaterial({
        map: materials['Glass_-_Heavy_Color'].map,
        side: materials['Glass_-_Heavy_Color'].side,
        toneMapped: false
      }),
    [materials]
  );
  useEffect(() => () => displayMaterial.dispose(), [displayMaterial]);

  const outerRef = useRef<Group>(null);
  const revealRef = useRef<Group>(null);
  const lidRef = useRef<Group>(null);
  const screenRef = useRef<Group>(null);

  const elapsed = useRef(0);
  // The first frames after the model mounts are expensive: shader compile,
  // texture upload, PMREM. Hold the intro clock at 0 until they are paid for,
  // otherwise the giant first delta fast-forwards the fly-in and the laptop
  // appears mid-flight (the "it jumps" look).
  const warm = useRef({ compiled: false, done: skipIntro, held: 0, smooth: 0, waited: 0 });
  const lights = useRef<{ ambient?: Light; camFill?: Light }>({});
  const playingIntro = useRef(!skipIntro);
  const lidT = useRef(skipIntro ? 0 : 1); // 0 = open, 1 = closed
  const focusCur = useRef(skipIntro ? 1 : 0); // 0 = wide/closed framing, 1 = near/open
  const exit = useRef<{ at: number; href: string; navigated?: boolean } | null>(null);
  const settledClosedRef = useRef(false);
  const [opened, setOpened] = useState(skipIntro);

  const restScale = clamp(size.width / SCALE_REF_WIDTH, REST_SCALE_MIN, REST_SCALE_MAX);

  const handleSelect = (href: string) => {
    if (exit.current) return;
    exit.current = { at: elapsed.current, href };
    setOpened(false);
  };

  useFrame((state, delta) => {
    const outer = outerRef.current;
    const reveal = revealRef.current;
    const lid = lidRef.current;
    const screen = screenRef.current;
    if (!outer || !reveal || !lid || !screen) return;

    const dt = Math.min(delta, MAX_DELTA);

    // Warm-up: the model has loaded (useGLTF suspends until it has), but its
    // first frames still cost shader compile + texture upload — historically one
    // ~800 ms stall that the intro then fast-forwarded through. Hold the laptop
    // at its fly-in start pose (far away, closed, logo to camera) until frames
    // come back smooth, then start the timeline.
    if (!warm.current.done) {
      const w = warm.current;
      if (!w.compiled) {
        w.compiled = true;
        state.gl.compile(state.scene, state.camera);
      }
      w.waited += delta * 1000; // real elapsed time, not the clamped delta

      if (delta * 1000 < SETTLED_FRAME_MS) w.smooth += 1;
      else w.smooth = 0;

      if (w.smooth >= SETTLED_FRAMES) w.held += delta * 1000;
      if (w.held >= WARMUP_HOLD_MS || w.waited >= WARMUP_CAP_MS) w.done = true;

      outer.position.set(0, 1.6, -22);
      outer.scale.setScalar(0.1 * restScale);
      outer.rotation.set(0, 0, 0);
      reveal.rotation.set(INTRO_TILT_X, INTRO_SPIN_Y, 0);
      lid.rotation.x = LID_CLOSED;
      state.camera.position.copy(CLOSED_CAM);
      state.camera.lookAt(CLOSED_LOOK);
      return;
    }

    elapsed.current += dt;
    const t = elapsed.current;
    const kFast = 1 - 0.82 ** (dt * 60); // camera follow + parallax/drag rotation
    const kToggle = 1 - 0.93 ** (dt * 60); // slower — the felt open/close lid + zoom

    // --- Exit: lid closes, laptop flies at the user, then navigate ---------
    if (exit.current) {
      const ep = clamp((t - exit.current.at) / EXIT_DUR);
      lid.rotation.x = lerp(LID_OPEN, LID_CLOSED, easeInOut(ep));
      const fly = easeInCubic(ep);
      outer.position.z = lerp(0, EXIT_FLY_Z, fly);
      outer.scale.setScalar(restScale * lerp(1, EXIT_SCALE, fly));
      // Navigate once at the end — but keep returning so the laptop stays in its
      // flown-out (off-camera) pose until this route unmounts. Nulling exit here
      // would let the next frame fall through to the idle reset, blinking the
      // laptop back to centre before the new page mounts.
      if (ep >= 1 && !exit.current.navigated) {
        exit.current.navigated = true;
        navigate(exit.current.href);
      }
      return;
    }

    // focus: 0 = wide/closed framing, 1 = near/open framing
    // lidParam: 0 = open, 1 = closed
    let focus: number;
    let lidParam: number;
    let rotTargetY = 0;
    let rotTargetX = 0;
    const sway = Math.sin(t * 0.5) * 0.025;

    if (playingIntro.current) {
      // --- Intro: fly in (closed, logo showing) → open → zoom in -----------
      const entrance = easeOutCubic(clamp(t / ENTRANCE_DUR));
      outer.position.set(0, lerp(1.6, 0, entrance), lerp(-22, 0, entrance));
      outer.scale.setScalar(lerp(0.1, 1, entrance) * restScale);

      const revealP = easeInOut(clamp(t / REVEAL_DUR));
      reveal.rotation.set(lerp(INTRO_TILT_X, 0, revealP), lerp(INTRO_SPIN_Y, 0, revealP), 0);

      const openP = clamp((t - OPEN_START) / OPEN_DUR);
      lidParam = 1 - easeOutBack(openP); // closed → open
      const focusRaw = clamp((t - FOCUS_START) / FOCUS_DUR);
      focus = easeInOut(focusRaw);
      focusCur.current = focus;

      // Parallax ramps in as the lid opens so idle continues seamlessly.
      rotTargetY = (state.pointer.x * 0.16 + sway) * openP;
      rotTargetX = -state.pointer.y * 0.1 * openP;

      // Menu is NOT revealed mid-intro — only once everything settles (below).
      if (focusRaw >= 1) {
        playingIntro.current = false;
        lidT.current = 0;
        onReady();
      }
    } else {
      // --- Idle: state-driven toggle (open ↔ closed) -----------------------
      reveal.rotation.set(0, 0, 0);
      outer.position.set(0, 0, 0);
      outer.scale.setScalar(restScale);

      const lidTarget = mode === 'closed' ? 1 : 0;
      lidT.current += (lidTarget - lidT.current) * kToggle;
      if (Math.abs(lidTarget - lidT.current) < 0.004) lidT.current = lidTarget; // snap → truly static
      lidParam = lidT.current;

      const focusTarget = mode === 'open' ? 1 : 0;
      focusCur.current += (focusTarget - focusCur.current) * kToggle;
      if (Math.abs(focusTarget - focusCur.current) < 0.004) focusCur.current = focusTarget;
      focus = focusCur.current;

      // Reveal the menu ONLY when the laptop is exactly at rest (fully open + fully
      // zoomed) — never while the camera is still easing — so it can't shift the zoom.
      const wantMenu = mode === 'open' && lidT.current === 0 && focusCur.current === 1;
      if (wantMenu !== opened) setOpened(wantMenu);

      // Tell the store once the lid has fully closed + the camera settled, so the
      // TopMenu only reveals after the close animation finishes (and hides the
      // moment the laptop starts opening again).
      const settledClosed = mode === 'closed' && lidT.current === 1 && focusCur.current === 0;
      if (settledClosed !== settledClosedRef.current) {
        settledClosedRef.current = settledClosed;
        useMacbookStore.getState().setSettledClosed(settledClosed);
      }

      if (mode === 'open') {
        rotTargetY = state.pointer.x * 0.16 + sway;
        rotTargetX = -state.pointer.y * 0.1;
      } else {
        rotTargetY = drag.current.yaw; // free orbit
        rotTargetX = drag.current.pitch;
      }
    }

    // Light rig follows the framing: full strength on the closed slab, dialled
    // back as the camera dollies into the screen.
    state.scene.environmentIntensity = lerp(ENV_INTENSITY_CLOSED, ENV_INTENSITY_OPEN, focus);
    const ambient =
      lights.current.ambient ?? (lights.current.ambient = state.scene.getObjectByName('ambient') as Light);
    const camFill =
      lights.current.camFill ?? (lights.current.camFill = state.scene.getObjectByName('camFill') as Light);
    if (ambient) ambient.intensity = lerp(AMBIENT_CLOSED, AMBIENT_OPEN, focus);
    if (camFill) camFill.intensity = lerp(CAM_FILL_CLOSED, CAM_FILL_OPEN, focus);

    lid.rotation.x = lerp(LID_OPEN, LID_CLOSED, lidParam);
    outer.rotation.y += (rotTargetY - outer.rotation.y) * kFast;
    outer.rotation.x += (rotTargetX - outer.rotation.x) * kFast;

    // --- Single camera path: blend wide(closed) ↔ near(open) by `focus` ----
    // Using one absolute lerp for every state means there is no hand-off jump
    // between intro, open and closed, and open always settles at the same zoom.
    screen.getWorldPosition(_screen);
    _pos.set(_screen.x, _screen.y + 0.05, _screen.z + NEAR_DIST);
    _closed.copy(CLOSED_CAM).sub(CLOSED_LOOK).multiplyScalar(zoom.current).add(CLOSED_LOOK);
    state.camera.position.lerpVectors(_closed, _pos, focus);
    _target.set(
      lerp(CLOSED_LOOK.x, _screen.x, focus),
      lerp(CLOSED_LOOK.y, _screen.y - NEAR_TARGET_DROP, focus),
      lerp(CLOSED_LOOK.z, _screen.z, focus)
    );
    state.camera.lookAt(_target);
  });

  return (
    <group
      ref={outerRef}
      dispose={null}
    >
      <group
        ref={revealRef}
        onClick={(e) => {
          e.stopPropagation();
          onClickModel();
        }}
      >
        <group rotation={[0, SPIN_Y, 0]}>
          <group rotation={[TILT_X, 0, 0]}>
            {/* Base — keyboard deck, hinge, feet */}
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_8.geometry}
              material={materials['Aluminum_-_Anodized_Glossy_Grey_keyboard.jpg']}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_16.geometry}
              material={materials['Bronze_-_Polished']}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_18.geometry}
              material={materials['Rubber_-_Soft']}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={nodes.Object_20.geometry}
              material={materials['Steel_-_Satin']}
            />

            {/* Lid — pivots about the hinge so it folds flush onto the deck */}
            <group
              ref={lidRef}
              position={[0, HINGE_Y, HINGE_Z]}
            >
              <group position={[0, -HINGE_Y, -HINGE_Z]}>
                {/* Lid shell — lengthened so the closed footprint matches the base */}
                <group scale={[1, 1, LID_STRETCH]}>
                  <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.Object_6.geometry}
                    material={materials['Aluminum_-_Anodized_Glossy_Grey']}
                  />
                  <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.Object_10.geometry}
                    material={displayMaterial}
                  />
                  <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.Object_12.geometry}
                    material={materials['Plastic_-_Translucent_Matte_Gray']}
                  />
                  <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.Object_14.geometry}
                    material={materials.Acrylic_Clear}
                  />
                </group>

                {/* Menu anchored to the screen plane — tilts & scales with the lid */}
                <group
                  position={SCREEN_CENTER}
                  ref={screenRef}
                  rotation={HTML_ROT}
                >
                  <Html
                    distanceFactor={1.35}
                    pointerEvents={opened ? 'auto' : 'none'}
                    portal={portal}
                    transform
                  >
                    <ScreenMenu
                      onNavigate={handleSelect}
                      opened={opened}
                    />
                  </Html>
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

const variants: A = {
  enter: { opacity: 1 },
  initial: { opacity: 1 }
};

export const Macbook = () => {
  const reduced = useReducedMotion();
  const navigate = useNavigate();
  const skipIntro = !!reduced;

  const mode = useMacbookStore((state) => state.mode);
  const setMode = useMacbookStore((state) => state.setMode);
  const requestOpen = useMacbookStore((state) => state.requestOpen);
  const [interactive, setInteractive] = useState(false);
  const [containerReady, setContainerReady] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null!);
  const attachContainer = useCallback((node: HTMLDivElement | null) => {
    if (node) containerRef.current = node;
    setContainerReady(!!node);
  }, []);

  // Landing on Home always shows the laptop open. The lid state lives in a store
  // (so the palette can drive it), which means it would otherwise persist a
  // "closed" state across navigation — reset it whenever the hero mounts.
  // biome-ignore lint/correctness/useExhaustiveDependencies: run once on mount
  useEffect(() => {
    setMode('open');
  }, []);

  // Pointer bookkeeping: tell a click apart from a drag, rotate + zoom while closed.
  const down = useRef<{ x: number; y: number } | null>(null);
  const moved = useRef(false);
  const drag = useRef<DragRot>({ pitch: 0, yaw: 0 });
  const zoom = useRef(1); // closed-view zoom factor (1 = default; only used when closed)

  // Reset the closed-view rotation + zoom each time we close, so it starts fresh.
  useEffect(() => {
    if (mode === 'closed') {
      drag.current = { pitch: 0, yaw: 0 };
      zoom.current = 1;
    }
  }, [mode]);

  // Scroll zooms the laptop — but only while it's closed.
  const onWheel = (e: React.WheelEvent) => {
    if (mode !== 'closed') return;
    zoom.current = clamp(zoom.current + e.deltaY * 0.0012, 0.55, 1.8);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    down.current = { x: e.clientX, y: e.clientY };
    moved.current = false;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!down.current || e.buttons !== 1) return;
    if (Math.hypot(e.clientX - down.current.x, e.clientY - down.current.y) > DRAG_THRESHOLD) moved.current = true;
    if (mode === 'closed' && moved.current) {
      // Spin freely around (yaw), but limit tilt (pitch) so the laptop never
      // reaches the razor edge-on angle where the lid/base seam would show.
      drag.current.yaw += e.movementX * 0.006;
      drag.current.pitch = clamp(drag.current.pitch + e.movementY * 0.006, -0.85, 0.85);
    }
  };

  const onPointerUp = () => {
    down.current = null;
  };

  return (
    <motion.div
      className='fixed top-0 right-0 h-full w-full'
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onWheel={onWheel}
      ref={attachContainer}
      style={{ touchAction: 'none' }}
      {...a(variants)}
    >
      {containerReady && (
        <Canvas
          camera={{ position: [1.3, 3, 3], zoom: 2 }}
          dpr={[1, 1.5]}
          onPointerMissed={() => interactive && !moved.current && setMode('closed')}
        >
          {/* Named so the frame loop can dim them as the camera moves in — see
            ENV_INTENSITY_CLOSED / _OPEN. */}
          <ambientLight
            intensity={AMBIENT_CLOSED}
            name='ambient'
          />
          {/* Key — overhead + soft, so the glossy deck/keys don't blow out */}
          <directionalLight
            intensity={0.45}
            position={[2, 9, 3]}
          />
          {/* Fill — left side */}
          <directionalLight
            intensity={0.3}
            position={[-6, 3, 4]}
          />
          {/* Camera-side fill — the closed lid faces the viewer, so without this it
            only ever catches edge highlights and reads as a silhouette. */}
          <directionalLight
            intensity={CAM_FILL_CLOSED}
            name='camFill'
            position={[1.5, 3.5, 4]}
          />
          {/* Bottom fill — so the underside isn't pure black when rotated */}
          <directionalLight
            intensity={0.25}
            position={[0, -5, 3]}
          />
          {/* Rim — separates the laptop from the dark space behind it. Carries the
            closed view, where the lid is otherwise a black shape on black. */}
          <directionalLight
            intensity={0.9}
            position={[0, 4, -6]}
          />
          <Suspense fallback={null}>
            <MacbookModel
              drag={drag}
              mode={mode}
              navigate={navigate}
              onClickModel={() => interactive && !moved.current && requestOpen()}
              onReady={() => setInteractive(true)}
              portal={containerRef}
              skipIntro={skipIntro}
              zoom={zoom}
            />
          </Suspense>
          <StudioEnvironment />
        </Canvas>
      )}
    </motion.div>
  );
};

useGLTF.preload('/macbook/macbook.gltf');
