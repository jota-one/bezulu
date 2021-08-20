export function formatTime(seconds) {
    const padStart = number => ('' + number).padStart('2', 0)

    let remaining = seconds

    
    const d = Math.floor(seconds / (24 * 3600))
    const dd = d > 0 ? `${d} days ` : ''

    remaining -= 24 * 3600 * d

    const h = Math.floor(remaining / 3600)
    const hh = h > 0
        ? d > 0 ? `${h}h ` : `${padStart(h)}:`
        : ''
    
    remaining -= 3600 * h
    
    const m = Math.floor(remaining / 60)
    const mm = d > 0 ? `${m}m ` : `${padStart(m)}:`
    
    remaining -= 60 * m
    
    const ss = d > 0 ? `${Math.floor(remaining)}s` : padStart(Math.floor(remaining))
    
    return `${dd}${hh}${mm}${ss}`
}