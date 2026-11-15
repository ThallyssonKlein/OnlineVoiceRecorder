const MIN_BAR_HEIGHT_PX = 4
const MAX_BAR_HEIGHT_PX = 40

interface WaveformProps {
  levels: number[]
  isActive: boolean
}

export function Waveform({ levels, isActive }: WaveformProps) {
  const barColorClassName = isActive ? 'bg-red-500' : 'bg-gray-300'

  return (
    <div className="flex items-center gap-0.5 h-10" data-testid="waveform">
      {levels.map((level, barIndex) => (
        <div
          key={barIndex}
          className={`w-0.75 rounded-full transition-all duration-75 ${barColorClassName}`}
          style={{ height: `${Math.max(MIN_BAR_HEIGHT_PX, level * MAX_BAR_HEIGHT_PX)}px` }}
        />
      ))}
    </div>
  )
}
