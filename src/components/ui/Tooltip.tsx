import { useState, useRef, useEffect, useId } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<number | undefined>(undefined);
  const tooltipId = useId();

  const show = () => {
    clearTimeout(timeoutRef.current);
    setIsVisible(true);
    // Auto-hide after 3s (for mobile tap)
    timeoutRef.current = window.setTimeout(() => setIsVisible(false), 3000);
  };

  const hide = () => {
    clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        onClick={(e) => {
          e.stopPropagation();
          show();
        }}
        className="cursor-help touch-manipulation"
        aria-describedby={isVisible ? tooltipId : undefined}
        aria-label="About this style"
      >
        {children}
      </button>
      {isVisible && (
        <div
          id={tooltipId}
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg shadow-lg w-52 z-[1100] pointer-events-none"
        >
          {content}
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
        </div>
      )}
    </div>
  );
}
