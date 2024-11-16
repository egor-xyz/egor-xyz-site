/* eslint-disable */

import { motion } from 'motion/react';
import { Environment, OrbitControls, useGLTF } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { Mesh, MeshStandardMaterial } from 'three';
import { GLTF } from 'three-stdlib';
import { a, A } from 'src/utils/a';

type GLTFResult = GLTF & {
  animations: any[];
  materials: {
    Acrylic_Clear: MeshStandardMaterial;
    ['Aluminum_-_Anodized_Glossy_Grey']: MeshStandardMaterial;
    ['Aluminum_-_Anodized_Glossy_Grey_keyboard.jpg']: MeshStandardMaterial;
    ['Bronze_-_Polished']: MeshStandardMaterial;
    ['Glass_-_Heavy_Color']: MeshStandardMaterial;
    ['Plastic_-_Translucent_Matte_Gray']: MeshStandardMaterial;
    ['Rubber_-_Soft']: MeshStandardMaterial;
    ['Steel_-_Satin']: MeshStandardMaterial;
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

function MacbookModel(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('/macbook/macbook.gltf') as GLTFResult;

  return (
    <group
      {...props}
      dispose={null}
      castShadow
      receiveShadow
    >
      <group rotation={[-1.4, -0.75, -2.1]}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_6.geometry}
          material={materials['Aluminum_-_Anodized_Glossy_Grey']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Object_8.geometry}
          material={materials['Aluminum_-_Anodized_Glossy_Grey_keyboard.jpg']}
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
      </group>
    </group>
  );
}

const variants: A = {
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 1.5,
      duration: 1
    }
  },
  initial: {
    opacity: 0,
    y: -100
  }
};

export const Macbook = () => {
  return (
    <motion.div
      className='fixed right-0 top-0 h-full w-full md:w-[70vw]'
      {...a(variants)}
    >
      <Canvas
        camera={{
          zoom: 1.4
        }}
      >
        <ambientLight intensity={1.2} />

        <directionalLight
          position={[0, -9, 0]}
          intensity={0.3}
          castShadow
        />

        <OrbitControls
          autoRotate
          autoRotateSpeed={3}
          enableZoom={false}
          enablePan={false}
          target={[0, 0.8, 0]}
        />
        <Suspense fallback={null}>
          <MacbookModel />
        </Suspense>
        <Environment preset='forest' />
      </Canvas>
    </motion.div>
  );
};

useGLTF.preload('/macbook/macbook.gltf');
