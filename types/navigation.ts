export interface IslandSection {
  id: string;
  title: string;
  description: string;
  route: string;
  icon: string;
  position: {
    desktop: { x: number; y: number };
    tablet: { x: number; y: number };
    mobile: { x: number; y: number };
  };
  size: 'small' | 'medium' | 'large';
  isMainHub?: boolean;
}

export interface SteppingStone {
  id: string;
  position: {
    desktop: { x: number; y: number };
    tablet: { x: number; y: number };
    mobile: { x: number; y: number };
  };
  size: number;
}

export interface NavigationPath {
  id: string;
  points: Array<{
    x: number;
    y: number;
  }>;
  strokeWidth: number;
  color: string;
}

export interface CloudDecoration {
  id: string;
  size: 'small' | 'medium' | 'large';
  position: {
    desktop: { x: number; y: number };
    tablet: { x: number; y: number };
    mobile: { x: number; y: number };
  };
  opacity: number;
}

export interface IslandAnimation {
  hover: {
    scale: number;
    y: number;
    transition: {
      duration: number;
      ease: string;
    };
  };
  tap: {
    scale: number;
    transition: {
      duration: number;
    };
  };
  initial: {
    opacity: number;
    y: number;
  };
  animate: {
    opacity: number;
    y: number;
    transition: {
      delay: number;
      duration: number;
      ease: string;
    };
  };
}

export type UserRole = 'student' | 'teacher';

export interface NavigationConfig {
  islands: IslandSection[];
  steppingStones: SteppingStone[];
  paths: NavigationPath[];
  clouds: CloudDecoration[];
  animations: {
    island: IslandAnimation;
    steppingStones: {
      hover: { scale: number };
      tap: { scale: number };
    };
  };
}