import React from 'react';
import { HelpCircle } from 'lucide-react';
import Tooltip from './Tooltip';

interface InfoTooltipProps {
  content: string;
  className?: string;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ content, className }) => {
  return (
    <Tooltip content={content} className={className}>
      <HelpCircle className="h-4 w-4 text-gray-400 hover:text-gray-600 cursor-help" />
    </Tooltip>
  );
};

export default InfoTooltip;