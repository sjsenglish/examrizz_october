import { NavigationConfig } from '@/types/navigation';

export const navigationConfig: NavigationConfig = {
  islands: [
    {
      id: 'practice',
      title: 'PRACTICE',
      description: 'Weekly revision with practice packs',
      route: '/practice',
      icon: '/icons/practice.svg',
      position: {
        desktop: { x: 50, y: 65 }, // Center-bottom - main hub (coffee cup)
        tablet: { x: 50, y: 60 },
        mobile: { x: 50, y: 55 }
      },
      size: 'large',
      isMainHub: true
    },
    {
      id: 'arena',
      title: 'ARENA',
      description: 'Competition and battles',
      route: '/competition',
      icon: '/icons/arena.svg',
      position: {
        desktop: { x: 35, y: 35 }, // Top center-left (toaster)
        tablet: { x: 35, y: 30 },
        mobile: { x: 35, y: 25 }
      },
      size: 'medium'
    },
    {
      id: 'video',
      title: 'VIDEO',
      description: 'On-demand topic study',
      route: '/video',
      icon: '/icons/video.svg',
      position: {
        desktop: { x: 75, y: 35 }, // Top right (retro TV)
        tablet: { x: 75, y: 30 },
        mobile: { x: 75, y: 25 }
      },
      size: 'medium'
    },
    {
      id: 'learn',
      title: 'LEARN',
      description: 'Learning paths and study buddy',
      route: '/learn',
      icon: '/icons/learn.svg',
      position: {
        desktop: { x: 80, y: 55 }, // Right side (ghost with book)
        tablet: { x: 75, y: 55 },
        mobile: { x: 75, y: 50 }
      },
      size: 'medium'
    },
    {
      id: 'teacher',
      title: 'TEACHER',
      description: 'Dashboard and class management',
      route: '/teacher',
      icon: '/icons/teacher.svg',
      position: {
        desktop: { x: 20, y: 75 }, // Bottom left (laptop/briefcase)
        tablet: { x: 25, y: 70 },
        mobile: { x: 25, y: 65 }
      },
      size: 'medium'
    }
  ],
  steppingStones: [
    {
      id: 'stone-1',
      position: {
        desktop: { x: 85, y: 75 },
        tablet: { x: 80, y: 75 },
        mobile: { x: 85, y: 75 }
      },
      size: 24
    },
    {
      id: 'stone-2',
      position: {
        desktop: { x: 90, y: 80 },
        tablet: { x: 85, y: 80 },
        mobile: { x: 90, y: 80 }
      },
      size: 20
    }
  ],
  paths: [
    {
      id: 'main-path',
      points: [
        { x: 50, y: 65 }, // From practice (center-bottom)
        { x: 85, y: 75 }, // To stepping stones (bottom right)
        { x: 100, y: 80 }
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