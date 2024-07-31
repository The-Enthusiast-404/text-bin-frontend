import React from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";

interface TooltipProps {
  id: string;
  content: string;
}

const Tooltip: React.FC<TooltipProps> = ({ id, content }) => {
  return (
    <ReactTooltip
      id={id}
      place="top"
      content={content}
      className="z-50 max-w-xs bg-gray-800 text-white px-2 py-1 rounded text-sm"
    />
  );
};

export default Tooltip;
