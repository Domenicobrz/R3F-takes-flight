import React, { Suspense, useEffect, useMemo, useRef } from "react";
import {
  PerspectiveCamera,
  Environment,
  OrbitControls,
} from "@react-three/drei";
import { Landscape } from "./Landscape";
import { Bloom, EffectComposer, N8AO, SSAO, SelectiveBloom } from "@react-three/postprocessing";
import { CameraHelper, DirectionalLightHelper } from "three";
import { useFrame, useThree } from "@react-three/fiber/";
import { BlurPass, Resizer, KernelSize, Resolution, GaussianBlurPass } from 'postprocessing';
import { SphereEnv } from "./SphereEnv";
import { Airplane } from "./Airplane";
import { Targets } from "./Targets";
import { MotionBlur } from "./MotionBlur";

let init = false;
function App() {
  const lightRef = useRef(null);
  const lightsRef = useRef(null);

  useFrame(({ scene }) => {
    // if (!init && lightRef.current) {
    //   // const helper = new DirectionalLightHelper( lightRef.current, 5 );
    //   // scene.add( helper );

    //   const helper = new CameraHelper( lightRef.current.shadow.camera );
    //   scene.add( helper );
    //   init = true;
    // }
  });

  // useEffect(() => {
  //   setTimeout(() => {
  //     const helper = new DirectionalLightHelper( lightRef.current, 5 );
  //     scene.add( helper );
  //   }, 1000);
  // }, []);

  return (
    <>
      {/* <Environment
        background={"only"}
        files={"assets/textures/envmap_blur.hdr"}
        ground={{ height: 100, radius: 300 }}
      /> */}
      <SphereEnv />
      <Environment background={false} files={"assets/textures/envmap.hdr"} />
      {/* <Environment preset="city" /> */}

      <PerspectiveCamera makeDefault position={[0, 10, 10]} />
      {/* <OrbitControls target={[0, 0, 0]} /> */}

      <Landscape ref={lightsRef} />
      <Airplane />
      <Targets />

      <directionalLight
        castShadow
        color={"#f3d29a"}
        intensity={2}
        position={[10, 5, 4]}
        shadow-bias={-0.0005}
        // shadow-autoUpdate={false}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.01}
        shadow-camera-far={20}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-camera-left={-6.2}
        shadow-camera-right={6.4}
        ref={lightRef}
      >
        {/* <group attach={"target"} position={[-1, 1, 0]}></group>    */}
      </directionalLight>

      {/* <mesh position={[2, 3, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          emissive={[100, 0.01, 0.01]}
          roughness={0.5}
          metalness={0.5}
          color={"#ff8956"}
        />
      </mesh> */}

      {/* <mesh position={[2, 0, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial
          roughness={0.5}
          metalness={0.5}
          color={"#ff8956"}
        />
      </mesh>

      <mesh position={[-2, 0, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial
          roughness={0.5}
          metalness={0.5}
          color={"#8956ff"}
        />
      </mesh> */}

      <EffectComposer>

        {/* note: by default, it's also including the envmap, so we're creating sphereEnv to offset that */}
        {/* <SelectiveBloom
          // lights={[lightRef1, lightRef2]} // ⚠️ REQUIRED! all relevant lights
          selection={[lightsRef]} // selection of objects that will have bloom effect
          selectionLayer={10} // selection layer
          intensity={1.4} // The bloom intensity.
          blurPass={undefined} // A blur pass.
          width={Resizer.AUTO_SIZE} // render width
          height={Resizer.AUTO_SIZE} // render height
          kernelSize={KernelSize.LARGE} // blur kernel size
          luminanceThreshold={0.3} // luminance threshold. Raise this value to mask out darker elements in the scene.
          luminanceSmoothing={0.025} // smoothness of the luminance threshold. Range is [0, 1]
        /> */}
        <MotionBlur />
      </EffectComposer>
    </>
  );
}

export default App;
