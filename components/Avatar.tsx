import React, { useEffect, useRef } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { Group, AnimationAction } from 'three';
import { CharacterAnimation } from '../types';

interface AvatarProps {
  animation: string;
}

// NOTE: We are using the "Robot Expressive" model from Three.js examples because it is hosted
// on a reliable public CDN and contains all the standard animations (Idle, Dance, Wave/Talk).
// To use "Bunny_Dance_Character.glb", you would replace this URL with your local path (e.g., "/Bunny_Dance_Character.glb")
// and ensure the animation names match those in the GLB file.
const MODEL_URL = '/Bunny_Dance_Character_1208145324_texture.glb';

export const Avatar: React.FC<AvatarProps> = ({ animation }) => {
  const group = useRef<Group>(null);
  const { scene, animations } = useGLTF(MODEL_URL);
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    // Stop all current animations
    Object.values(actions).forEach((action) => (action as AnimationAction | null)?.fadeOut(0.5));

    // Determine which animation to play
    let actionToPlay = actions[CharacterAnimation.IDLE]; // Default

    // Map high-level state to specific model animation names
    if (animation === CharacterAnimation.TALKING) {
      // RobotExpressive doesn't have "Talk", but "Wave" or "Yes" works for movement
      // Or we can blend. Let's use 'Wave' for activity while talking.
      actionToPlay = actions['Wave']; 
    } else if (animation === CharacterAnimation.DANCE) {
      actionToPlay = actions['Dance'];
    } else if (animation === CharacterAnimation.IDLE) {
      actionToPlay = actions['Idle'];
    }

    if (actionToPlay) {
      actionToPlay.reset().fadeIn(0.5).play();
    }

    return () => {
      actionToPlay?.fadeOut(0.5);
    };
  }, [animation, actions]);

  // Clone scene to avoid mutation issues if reused, though not strictly necessary here
  return (
    <group ref={group} dispose={null} position={[0, -2, 0]} scale={[1.2, 1.2, 1.2]}>
      <primitive object={scene} />
    </group>
  );
};

// Preload to avoid pop-in
useGLTF.preload(MODEL_URL);
