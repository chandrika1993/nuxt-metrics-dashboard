export const formatPercent = (ratio: number) => `${(ratio * 100).toFixed(1)}%`

export const formatHours = (hours: number) => `${hours.toFixed(1)} h`

export const formatNumber = (value: number) => value.toLocaleString('en-US', { maximumFractionDigits: 1 })
