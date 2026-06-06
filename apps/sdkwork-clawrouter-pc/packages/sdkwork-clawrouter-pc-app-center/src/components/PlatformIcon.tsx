import React from 'react';
import { Monitor, Smartphone, Globe, MessageCircle, Terminal } from 'lucide-react';
import type { PlatformType, OS } from '../appRuntime';

interface PlatformIconProps {
  type: PlatformType;
  os?: OS;
  className?: string;
}

export const PlatformIcon: React.FC<PlatformIconProps> = ({ type, os, className = "w-4 h-4" }) => {
  if (os === 'Linux') return <Terminal className={className} />;
  if (type === 'Desktop') return <Monitor className={className} />;
  if (type === 'Mobile') return <Smartphone className={className} />;
  if (type === 'Mini Program') return <MessageCircle className={className} />;
  return <Globe className={className} />;
};
