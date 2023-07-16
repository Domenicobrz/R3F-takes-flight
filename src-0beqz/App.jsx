import React, { Suspense, useEffect, useMemo, useRef } from "react";
import {
  PerspectiveCamera,
  Environment,
} from "@react-three/drei";
import { OrbitControls } from "three-stdlib";
import { Landscape } from "./Landscape";
import * as POSTPROCESSING from "postprocessing";
import {
  SSGIEffect,
  TRAAEffect,
  MotionBlurEffect,
  VelocityDepthNormalPass,
  HBAOEffect,
} from "realism-effects";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";

function App() {
  const { camera, scene, gl } = useThree();
  const orbitControlsRef = useRef(null);
  const composer = useMemo(() => {
    const composer = new POSTPROCESSING.EffectComposer(gl);

    const renderPass = new POSTPROCESSING.RenderPass(scene, camera);
    composer.addPass(renderPass);
    
    const velocityDepthNormalPass = new VelocityDepthNormalPass(scene, camera);
    composer.addPass(velocityDepthNormalPass);

    // SSGI
    const ssgiEffect = new SSGIEffect(
      scene,
      camera,
      velocityDepthNormalPass,
      {
        distance: 2.00000000000104,
        thickness: 0.1999999999999972,
        // distance: 2.7200000000000104,
        // thickness: 1.2999999999999972,
        autoThickness: false,
        maxRoughness: 1,
        blend: 0.95,
        denoiseIterations: 3,
        denoiseKernel: 3,
        denoiseDiffuse: 25,
        denoiseSpecular: 25.54,
        depthPhi: 5,
        normalPhi: 28,
        roughnessPhi: 18.75,
        envBlur: 0.01,
        importanceSampling: true,
        directLightMultiplier: 1,
        steps: 40,
        refineSteps: 4,
        spp: 1,
        resolutionScale: 1,
        missedRays: false
      }
    );

    // TRAA
    const traaEffect = new TRAAEffect(scene, camera, velocityDepthNormalPass);

    // // Motion Blur
    const motionBlurEffect = new MotionBlurEffect(velocityDepthNormalPass);

    // // SSAO
    // const ssaoEffect = new SSAOEffect(composer, camera, scene);

    // // HBAO
    // const hbaoEffect = new HBAOEffect(composer, camera, scene);

    const effectPass = new POSTPROCESSING.EffectPass(
      camera,
      ssgiEffect,
    );

    composer.addPass(effectPass);
    // composer.addPass(new POSTPROCESSING.EffectPass(
    //   camera,
    //   motionBlurEffect,
    // ));
    // composer.addPass(new POSTPROCESSING.EffectPass(
    //   camera,
    //   hbaoEffect,
    // ));

    return composer;
  }, []);

  useFrame(({ scene }) => {
    if (!orbitControlsRef.current) {
      orbitControlsRef.current = new OrbitControls(camera, gl.domElement);
      orbitControlsRef.current.target = new Vector3(0, 0, 0);
      orbitControlsRef.current.enableDamping = true;
      orbitControlsRef.current.enablePan = true;
      orbitControlsRef.current.minDistance = 0;
      orbitControlsRef.current.maxDistance = 20;
    }

    orbitControlsRef.current.update();
    camera.updateMatrix();
    camera.updateMatrixWorld();
    camera.updateWorldMatrix();


    composer.render();
  }, 1);

  return (
    <>
      {/* <Environment
        background={"only"}
        files={"assets/textures/envmap_blur.hdr"}
        ground={{ height: 100, radius: 300 }}
      /> */}
      <Environment
        background={"only"}
        blur={0.5}
        files={"assets/textures/envmap.hdr"}
      />
      <Environment background={false} files={"assets/textures/envmap.hdr"} />
      {/* <Environment preset="city" /> */}

      <PerspectiveCamera makeDefault fov={45} position={[0, 10, 10]} />

      <Suspense fallback={null}>
        <Landscape />
      </Suspense>


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
    </>
  );
}

export default App;
