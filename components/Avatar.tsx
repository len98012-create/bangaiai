import React, { useEffect, useRef } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { Group, AnimationAction } from 'three';
import { CharacterAnimation } from '../types';

interface AvatarProps {
  animation: string;
}

const MODEL_URL = '/Bunny_Dance_Character_1208145324_texture.glb';

export const Avatar: React.FC<AvatarProps> = ({ animation }) => {
  const group = useRef<Group>(null);
  const { scene, animations } = useGLTF(MODEL_URL);
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    Object.values(actions).forEach((action) => (action as AnimationAction | null)?.fadeOut(0.5));

    let actionToPlay: AnimationAction | undefined = actions[CharacterAnimation.IDLE];

    if (animation === CharacterAnimation.TALKING) {
      actionToPlay = actions['Wave']; // Thay tên animation nếu khác
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

  return (
    <group
      ref={group}
      dispose={null}
      position={[0, 0, 0]} // model đứng nổi
      scale={[3, 3, 3]}    // phóng to để nhìn rõ
    >
      <primitive object={scene} />
    </group>
  );
};

useGLTF.preload(MODEL_URL);
