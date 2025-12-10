import React, { useEffect, useRef } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { Group, AnimationAction } from 'three';
import { CharacterAnimation } from '../types';

interface AvatarProps {
  animation: string;
}

// Đường dẫn tới file GLB đặt trong thư mục public
const MODEL_URL = '/Bunny_Dance_Character_1208145324_texture.glb';

export const Avatar: React.FC<AvatarProps> = ({ animation }) => {
  const group = useRef<Group>(null);
  const { scene, animations } = useGLTF(MODEL_URL);
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    // Dừng tất cả animation hiện tại
    Object.values(actions).forEach(
      (action) => (action as AnimationAction | null)?.fadeOut(0.5)
    );

    // Animation mặc định
    let actionToPlay: AnimationAction | undefined = actions[CharacterAnimation.IDLE];

    // Map trạng thái animation của nhân vật
    if (animation === CharacterAnimation.TALKING) {
      actionToPlay = actions['Wave']; // Thay 'Wave' bằng tên animation Talk trong GLB nếu khác
    } else if (animation === CharacterAnimation.DANCE) {
      actionToPlay = actions['Dance']; // Thay 'Dance' bằng tên animation Dance trong GLB nếu khác
    } else if (animation === CharacterAnimation.IDLE) {
      actionToPlay = actions['Idle']; // Thay 'Idle' bằng tên animation Idle trong GLB nếu khác
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
      position={[0, -0.5, 0]} // Nâng model lên khỏi đáy màn hình
      scale={[3, 3, 3]}       // Tăng kích thước model
    >
      <primitive object={scene} />
    </group>
  );
};

// Preload GLB để tránh pop-in
useGLTF.preload(MODEL_URL);
