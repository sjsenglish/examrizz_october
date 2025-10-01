import { NavigationConfig } from '@/types/navigation';
import { 
  ArenaIcon, 
  PracticeIcon, 
  LearnIcon, 
  VideoIcon, 
  TeacherIcon 
} from '@/components/icons';

export const navigationConfig: NavigationConfig = {
  islands: [
    {
      id: 'practice',
      title: 'PRACTICE',
      description: 'Weekly revision with practice packs',
      route: '/practice',
      icon: PracticeIcon,
      position: {
        desktop: { x: 50, y: 50 }, // Center - main hub
        tablet: { x: 50, y: 45 },
        mobile: { x: 50, y: 40 }
      },
      size: 'large',
      isMainHub: true
    },
    {
      id: 'arena',
      title: 'ARENA',
      description: 'Competition and battles',
      route: '/competition',
      icon: ArenaIcon,
      position: {
        desktop: { x: 25, y: 30 }, // Top left area
        tablet: { x: 30, y: 25 },
        mobile: { x: 25, y: 25 }
      },
      size: 'medium'
    },
    {
      id: 'video',
      title: 'VIDEO',
      description: 'On-demand topic study',
      route: '/video',
      icon: VideoIcon,
      position: {
        desktop: { x: 75, y: 30 }, // Top right area
        tablet: { x: 70, y: 25 },
        mobile: { x: 75, y: 25 }
      },
      size: 'medium'
    },
    {
      id: 'learn',
      title: 'LEARN',
      description: 'Learning paths and study buddy',
      route: '/learn',
      icon: LearnIcon,
      position: {
        desktop: { x: 75, y: 70 }, // Bottom right
        tablet: { x: 70, y: 65 },
        mobile: { x: 75, y: 65 }
      },
      size: 'medium'
    },
    {
      id: 'teacher',
      title: 'TEACHER',
      description: 'Dashboard and class management',
      route: '/teacher',
      icon: TeacherIcon,
      position: {
        desktop: { x: 25, y: 70 }, // Bottom left
        tablet: { x: 30, y: 65 },
        mobile: { x: 25, y: 65 }
      },
      size: 'medium'
    }
  ],
  steppingStones: [
    {
      id: 'stone-1',
      position: {
        desktop: { x: 85, y: 45 },
        tablet: { x: 80, y: 45 },
        mobile: { x: 85, y: 45 }
      },
      size: 24
    },
    {
      id: 'stone-2',
      position: {
        desktop: { x: 90, y: 50 },
        tablet: { x: 85, y: 50 },
        mobile: { x: 90, y: 50 }
      },
      size: 20
    },
    {
      id: 'stone-3',
      position: {
        desktop: { x: 95, y: 45 },
        tablet: { x: 90, y: 45 },
        mobile: { x: 95, y: 45 }
      },
      size: 18
    }
  ],
  paths: [
    {
      id: 'main-path',
      points: [
        { x: 50, y: 50 }, // From practice (center)
        { x: 85, y: 45 }, // To stepping stones
        { x: 100, y: 45 }
      ],
      strokeWidth: 3,
      color: '#00CED1'
    }
  ],
  clouds: [
    {
      id: 'cloud-1',
      size: 'medium',
      position: {
        desktop: { x: 15, y: 15 },
        tablet: { x: 20, y: 15 },
        mobile: { x: 15, y: 15 }
      },
      opacity: 0.6
    },
    {
      id: 'cloud-2',
      size: 'large',
      position: {
        desktop: { x: 60, y: 10 },
        tablet: { x: 60, y: 10 },
        mobile: { x: 60, y: 10 }
      },
      opacity: 0.4
    },
    {
      id: 'cloud-3',
      size: 'small',
      position: {
        desktop: { x: 90, y: 20 },
        tablet: { x: 85, y: 20 },
        mobile: { x: 90, y: 20 }
      },
      opacity: 0.7
    },
    {
      id: 'cloud-4',
      size: 'medium',
      position: {
        desktop: { x: 10, y: 80 },
        tablet: { x: 15, y: 80 },
        mobile: { x: 10, y: 80 }
      },
      opacity: 0.5
    },
    {
      id: 'cloud-5',
      size: 'small',
      position: {
        desktop: { x: 85, y: 85 },
        tablet: { x: 80, y: 85 },
        mobile: { x: 85, y: 85 }
      },
      opacity: 0.6
    }
  ],
  animations: {
    island: {
      hover: {
        scale: 1.05,
        y: -8,
        transition: {
          duration: 0.3,
          ease: 'easeOut'
        }
      },
      tap: {
        scale: 0.98,
        transition: {
          duration: 0.1
        }
      },
      initial: {
        opacity: 0,
        y: 50
      },
      animate: {
        opacity: 1,
        y: 0,
        transition: {
          delay: 0,
          duration: 0.6,
          ease: 'easeOut'
        }
      }
    },
    steppingStones: {
      hover: { scale: 1.1 },
      tap: { scale: 0.95 }
    }
  }
};