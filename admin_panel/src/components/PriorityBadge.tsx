import React from 'react';

interface Props {
  priority: string;
}

export const PriorityBadge: React.FC<Props> = ({ priority }) => {
  const getStyle = () => {
    switch (priority.toUpperCase()) {
      case 'URGENT':
        return 'bg-red-100 text-red-800 font-bold border-red-300';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 font-semibold border-orange-300';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'LOW':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <span className={`px-2 py-0.5 rounded text-xs border ${getStyle()}`}>
      {priority}
    </span>
  );
};
