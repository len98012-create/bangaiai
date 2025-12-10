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
