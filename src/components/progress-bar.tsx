interface ProgressBarProps {
  progress: number; // 0 to 100
}

export default function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className='relative w-full bg-gray-300 rounded-full h-4 overflow-hidden'>
      <div
        className='h-4 rounded-full transition-all duration-300'
        style={{
          width: `${progress}%`,
          backgroundImage: `repeating-linear-gradient(
              45deg,
              #2563eb,
              #2563eb 10px,
              #3b82f6 10px,
              #3b82f6 20px
            )`,
          animation: "moveStripes 1s linear infinite",
          backgroundSize: "40px 40px",
        }}
      />
      <div className='absolute inset-0 flex items-center justify-center text-sm font-medium text-white select-none'>
        {progress}%
      </div>

      <style>
        {`
          @keyframes moveStripes {
            0% {
              background-position: 0 0;
            }
            100% {
              background-position: 40px 0;
            }
          }
        `}
      </style>
    </div>
  );
}
