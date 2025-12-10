import React, { useEffect, useRef } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { Group, AnimationAction } from 'three';
import { CharacterAnimation } from '../types';

interface AvatarProps {
  animation: string;
}

// NOTE: Using RobotExpressive as placeholder.
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

  // Position at [0, -1, 0] (Standard floor)
  // Scale [2, 2, 2] (Larger size to fill screen)
  return (
    <group ref={group} dispose={null} position={[0, -1, 0]} scale={[2, 2, 2]}>
      <primitive object={scene} />
    </group>
  );
};

useGLTF.preload(MODEL_URL);
