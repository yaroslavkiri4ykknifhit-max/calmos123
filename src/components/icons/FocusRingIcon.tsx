interface FocusRingIconProps {
  className?: string;
}

export default function FocusRingIcon({ className = 'w-5 h-5' }: FocusRingIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer ring — barely visible */}
      <circle
        cx="12"
        cy="12"
        r="10.5"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.2"
      />
      {/* Middle ring */}
      <circle
        cx="12"
        cy="12"
        r="7"
        stroke="currentColor"
        strokeWidth="1.3"
        opacity="0.4"
      />
      {/* Inner ring */}
      <circle
        cx="12"
        cy="12"
        r="3.5"
        stroke="currentColor"
        strokeWidth="1.4"
        opacity="0.7"
      />
      {/* Center dot */}
      <circle cx="12" cy="12" r="1.5" fill="currentColor" opacity="0.9" />
    </svg>
  );
}
