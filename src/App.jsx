import { useEffect, useMemo, useRef, useState } from 'react'
import Spline from '@splinetool/react-spline'

const STATUS = {
  ACTIVE: 'ACTIVE',
  COPYING: 'COPYING',
  SLEEPING: 'SLEEPING',
}

const sleepMessages = [
  'idle timeout detected...',
  'switching to low-power cognition mode...',
  'dreaming in neural vectors...',
]

function App() {
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 })
  const [status, setStatus] = useState(STATUS.ACTIVE)
  const [isIdle, setIsIdle] = useState(false)
  const [copiedFlash, setCopiedFlash] = useState(false)
  const [terminalLine, setTerminalLine] = useState('// status: building')
  const idleTimer = useRef(null)
  const copyTimer = useRef(null)

  const robotMood = useMemo(() => {
    if (status === STATUS.COPYING) return 'Copy detected. Vision spectrum changed.'
    if (status === STATUS.SLEEPING) return 'No interaction detected. Entering sleep mode... zzz'
    return 'Observing cursor trajectory. Systems online.'
  }, [status])

  useEffect(() => {
    const wakeUp = () => {
      setIsIdle(false)
      setStatus((current) => (current === STATUS.COPYING ? STATUS.COPYING : STATUS.ACTIVE))
      setTerminalLine('// status: building')

      if (idleTimer.current) clearTimeout(idleTimer.current)
      idleTimer.current = setTimeout(() => {
        setIsIdle(true)
        setStatus((current) => (current === STATUS.COPYING ? STATUS.COPYING : STATUS.SLEEPING))
        setTerminalLine(sleepMessages[Math.floor(Math.random() * sleepMessages.length)])
      }, 6000)
    }

    const handleMouseMove = (event) => {
      const x = event.clientX / window.innerWidth
      const y = event.clientY / window.innerHeight
      setMouse({ x, y })
      wakeUp()
    }

    const handleInteraction = () => wakeUp()

    const handleCopy = () => {
      setCopiedFlash(true)
      setStatus(STATUS.COPYING)
      setTerminalLine('// copy event detected :: retina override enabled')

      if (copyTimer.current) clearTimeout(copyTimer.current)
      copyTimer.current = setTimeout(() => {
        setCopiedFlash(false)
        setStatus(isIdle ? STATUS.SLEEPING : STATUS.ACTIVE)
        setTerminalLine(isIdle ? 'dreaming in neural vectors...' : '// status: building')
      }, 1600)
    }

    wakeUp()

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('keydown', handleInteraction)
    window.addEventListener('scroll', handleInteraction)
    window.addEventListener('click', handleInteraction)
    document.addEventListener('copy', handleCopy)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('keydown', handleInteraction)
      window.removeEventListener('scroll', handleInteraction)
      window.removeEventListener('click', handleInteraction)
      document.removeEventListener('copy', handleCopy)
      clearTimeout(idleTimer.current)
      clearTimeout(copyTimer.current)
    }
  }, [isIdle])

  const eyeTransform = {
    transform: `translate(${(mouse.x - 0.5) * 16}px, ${(mouse.y - 0.5) * 16}px)`,
  }

  return (
    <main className="page-shell">
      <div className="noise" />
      <section className="hero-card">
        <header className="hero-header">
          <span className="eyebrow">Coming Soon</span>
          <h1>AUTONOMOUS SYSTEMS/AI INFRASTRUCTURE</h1>
          <p>
            High-performance portfolio interface currently assembling intelligent systems,
            automation layers and production-grade AI tooling.
          </p>
        </header>

        <div className="robot-stage">
          <div className={`robot-frame ${status.toLowerCase()}`}>
            <div className="robot-overlay">
              <div className={`robot-face ${status === STATUS.SLEEPING ? 'sleeping' : ''}`}>
                <div className={`eye eye-left ${copiedFlash ? 'copying' : ''}`} style={eyeTransform} />
                <div className={`eye eye-right ${copiedFlash ? 'copying' : ''}`} style={eyeTransform} />
                {status === STATUS.SLEEPING && <div className="zzz">zzz</div>}
              </div>
            </div>

            <Spline scene="https://my.spline.design/genkubgreetingrobot-Zw1LQErETOreJIi1M6WLp1n3/" />
          </div>

          <div className="personality-panel">
            <div className="status-pill">
              <span className={`status-dot ${status.toLowerCase()}`} />
              {status === STATUS.ACTIVE && 'Engaged'}
              {status === STATUS.COPYING && 'Alert'}
              {status === STATUS.SLEEPING && 'Sleep mode'}
            </div>
            <p>{robotMood}</p>
          </div>
        </div>

        <section className="terminal-panel" aria-label="Build terminal">
          <div className="terminal-topbar">
            <span />
            <span />
            <span />
          </div>
          <div className="terminal-body">
            <p><span className="prompt">root@portfolio:~$</span> initialize --presence</p>
            <p><span className="prompt">system@ai-core:~$</span> {terminalLine}</p>
            <p><span className="prompt">deploy@node-01:~$</span> next public release pending...</p>
          </div>
        </section>
      </section>
    </main>
  )
}

export default App
