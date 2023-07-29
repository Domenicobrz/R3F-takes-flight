import { useTexture } from "@react-three/drei";
import { BackSide } from "three";

export function SphereEnv() {
  const map = useTexture("assets/textures/envmap.jpg");

  return <mesh>
    <sphereGeometry args={[60, 50, 50]} />
    <meshBasicMaterial 
      side={BackSide}
      map={map}
    />
  </mesh>
}