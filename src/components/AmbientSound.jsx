import { useState, useRef, useEffect } from "react"
import { Music, Volume2, VolumeX, Coffee, Wind, Waves, TreePine } from "lucide-react"

const SOUNDS = [
  { id:"lofi",   label:"Lofi",    icon:Music,    freq:60,  type:"lofi" },
  { id:"cafe",   label:"Café",    icon:Coffee,   freq:200, type:"cafe" },
  { id:"rain",   label:"Pluie",   icon:Waves,    freq:100, type:"rain" },
  { id:"forest", label:"Forêt",   icon:TreePine, freq:150, type:"forest" },
  { id:"wind",   label:"Vent",    icon:Wind,     freq:80,  type:"wind" },
]

function createAmbientSound(type, ctx) {
  const nodes = []
  if (type === "rain" || type === "wind" || type === "forest") {
    const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (type === "wind" ? 0.15 : 0.08)
    const src = ctx.createBufferSource()
    src.buffer = buf; src.loop = true
    const filter = ctx.createBiquadFilter()
    filter.type = type === "wind" ? "lowpass" : "bandpass"
    filter.frequency.value = type === "rain" ? 3000 : type === "forest" ? 800 : 400
    src.connect(filter); nodes.push(src, filter)
    return { nodes, output: filter }
  }
  // Lofi / cafe = oscillateurs
  const osc = ctx.createOscillator()
  osc.type = "sine"; osc.frequency.value = type === "lofi" ? 55 : 110
  nodes.push(osc)
  return { nodes, output: osc }
}

export default function AmbientSound() {
  const [active, setActive] = useState(null)
  const [vol, setVol] = useState(0.3)
  const ctxRef = useRef(null)
  const gainRef = useRef(null)
  const nodesRef = useRef([])

  const stop = () => {
    nodesRef.current.forEach(n => { try { n.stop?.(); n.disconnect?.() } catch {} })
    nodesRef.current = []
    if (ctxRef.current) { ctxRef.current.close(); ctxRef.current = null }
    setActive(null)
  }

  const play = (sound) => {
    stop()
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    ctxRef.current = ctx
    const gain = ctx.createGain()
    gain.gain.value = vol
    gainRef.current = gain
    gain.connect(ctx.destination)
    const { nodes, output } = createAmbientSound(sound.type, ctx)
    output.connect(gain)
    nodes.forEach(n => n.start?.())
    nodesRef.current = nodes
    setActive(sound.id)
  }

  useEffect(() => {
    if (gainRef.current) gainRef.current.gain.value = vol
  }, [vol])

  useEffect(() => () => stop(), [])

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white/70 text-sm font-semibold">Son'ambiant</h3>
        {active && <button onClick={stop} className="text-white/40 hover:text-white/60 transition-colors"><VolumeX size={14}/></button>}
      </div>
      <div className="flex gap-2 flex-wrap mb-3">
        {SOUNDS.map(s => {
          const Icon = s.icon
          return (
            <button key={s.id} onClick={() => active === s.id ? stop() : play(s)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs transition-all"
              style={{ background: active===s.id ? "rgba(139,92,246,0.2)" : "rgba(255,255,255,0.04)", border: active===s.id ? "1px solid rgba(139,92,246,0.4)" : "1px solid rgba(255,255,255,0.06)", color: active===s.id ? "#a78bfa" : "rgba(255,255,255,0.5)" }}>
              <Icon size={11}/> {s.label}
            </button>
          )
        })}
      </div>
      {active && (
        <div className="flex items-center gap-2">
          <Volume2 size={12} className="text-white/30 flex-shrink-0"/>
          <input type="range" min="0" max="1" step="0.05" value={vol}
            onChange={e => setVol(parseFloat(e.target.value))}
            className="flex-1 accent-violet-500 h-1" />
        </div>
      )}
    </div>
  )
}