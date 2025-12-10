import { Object3DNode } from '@react-three/fiber';
import { Group, AmbientLight, DirectionalLight } from 'three';

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export type AnimationState = 'Idle' | 'Walking' | 'Dance' | 'Jump' | 'Death' | 'Sitting' | 'Standing';

// Common animations found in standard mixamo/threejs example models
// For the specific RobotExpressive model we are using as a default:
// It has: Dance, Death, Idle, Jump, No, Punch, Running, Sitting, Standing, ThumbsUp, Walking, WalkJump, Wave, Yes
export enum CharacterAnimation {
  IDLE = 'Idle',
  TALKING = 'Wave', // We use Wave or a specific talk animation if available to simulate talking gestures
  DANCE = 'Dance',
  WALK = 'Walking'
}

// Fix for TypeScript errors where React Three Fiber elements are not recognized in JSX
declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: Object3DNode<Group, typeof Group>;
      ambientLight: Object3DNode<AmbientLight, typeof AmbientLight>;
      directionalLight: Object3DNode<DirectionalLight, typeof DirectionalLight>;
      primitive: any;
    }
  }
}
