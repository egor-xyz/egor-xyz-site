import { Environment, Html, useGLTF } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { motion, useReducedMotion } from 'motion/react';
import { Suspense, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMacbookStore } from 'src/store/macbookStore';
import { type A, a } from 'src/utils/a';
import { type Group, type Mesh, type MeshStandardMaterial, Vector3 } from 'three';
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
const NEAR_DIST = 1.95; // open framing — screen ~80%, keyboard just peeks in
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

type ModelProps = {
  drag: React.RefObject<DragRot>;
  mode: 'open' | 'closed';
  navigate: (href: string) => void;
  onClickModel: () => void;
  onReady: () => void;
  skipIntro: boolean;
  zoom: React.RefObject<number>;
};

function MacbookModel({ drag, mode, navigate, onClickModel, onReady, skipIntro, zoom }: ModelProps) {
  const { nodes, materials } = useGLTF('/macbook/macbook.gltf') as unknown as GLTFResult;
  const { size } = useThree();

  const outerRef = useRef<Group>(null);
  const revealRef = useRef<Group>(null);
  const lidRef = useRef<Group>(null);
  const screenRef = useRef<Group>(null);

  const elapsed = useRef(0);
  const playingIntro = useRef(!skipIntro);
  const lidT = useRef(skipIntro ? 0 : 1); // 0 = open, 1 = closed
  const focusCur = useRef(skipIntro ? 1 : 0); // 0 = wide/closed framing, 1 = near/open
  const exit = useRef<{ at: number; href: string; navigated?: boolean } | null>(null);
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

    elapsed.current += delta;
    const t = elapsed.current;
    const kFast = 1 - 0.82 ** (delta * 60); // camera follow + parallax/drag rotation
    const kToggle = 1 - 0.93 ** (delta * 60); // slower — the felt open/close lid + zoom

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

      if (mode === 'open') {
        rotTargetY = state.pointer.x * 0.16 + sway;
        rotTargetX = -state.pointer.y * 0.1;
      } else {
        rotTargetY = drag.current.yaw; // free orbit
        rotTargetX = drag.current.pitch;
      }
    }

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
                    material={materials['Glass_-_Heavy_Color']}
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
  const [interactive, setInteractive] = useState(false);

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
      style={{ touchAction: 'none' }}
      {...a(variants)}
    >
      <Canvas
        camera={{ position: [1.3, 3, 3], zoom: 2 }}
        onPointerMissed={() => interactive && !moved.current && setMode('closed')}
      >
        <ambientLight intensity={0.95} />
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
        {/* Bottom fill — so the underside isn't pure black when rotated */}
        <directionalLight
          intensity={0.25}
          position={[0, -5, 3]}
        />
        {/* Rim — separates the laptop from the dark space behind it */}
        <directionalLight
          intensity={0.45}
          position={[0, 4, -6]}
        />
        <Suspense fallback={null}>
          <MacbookModel
            drag={drag}
            mode={mode}
            navigate={navigate}
            onClickModel={() => interactive && !moved.current && setMode('open')}
            onReady={() => setInteractive(true)}
            skipIntro={skipIntro}
            zoom={zoom}
          />
        </Suspense>
        <Environment
          environmentIntensity={0.32}
          preset='city'
        />
      </Canvas>
    </motion.div>
  );
};

useGLTF.preload('/macbook/macbook.gltf');
