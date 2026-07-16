import { useEffect, useMemo, useRef, useState, Suspense, Component } from 'react'
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

class SplineErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="spline-fallback">
          <span>[ ROBOT OFFLINE ]</span>
        </div>
      )
    }
    return this.props.children
  }
}

function RobotScene() {
  return (
    <SplineErrorBoundary>
      <Suspense fallback={<div className="spline-fallback"><span>Loading...</span></div>}>
        <Spline
          scene="https://my.spline.design/genkubgreetingrobot-Zw1LQErETOreJIi1M6WLp1n3/"
        />
      </Suspense>
    </SplineErrorBoundary>
  )
}

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

    const handleMouseMove = (e) => {
      setMouse({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight })
      wakeUp()
    }

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
    window.addEventListener('keydown', wakeUp)
    window.addEventListener('scroll', wakeUp)
    window.addEventListener('click', wakeUp)
    document.addEventListener('copy', handleCopy)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('keydown', wakeUp)
      window.removeEventListener('scroll', wakeUp)
      window.removeEventListener('click', wakeUp)
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
          <h1>AUTONOMOUS SYSTEMS<br />/AI INFRASTRUCTURE</h1>
          <p>
            High-performance portfolio interface currently assembling intelligent systems,
            automation layers and production-grade AI tooling.
          </p>
        </header>

        <div className="robot-stage">

          {/* Robot frame — Spline lives here as absolute fill, overlay on top */}
          <div className={`robot-frame ${status.toLowerCase()}`}>

            {/* Spline as background layer */}
            <div className="spline-bg">
              <RobotScene />
            </div>

            {/* Eye overlay on top of Spline */}
            <div className="robot-overlay">
              <div className={`robot-face ${status === STATUS.SLEEPING ? 'sleeping' : ''}`}>
                <div className={`eye eye-left ${copiedFlash ? 'copying' : ''}`} style={eyeTransform} />
                <div className={`eye eye-right ${copiedFlash ? 'copying' : ''}`} style={eyeTransform} />
                {status === STATUS.SLEEPING && <div className="zzz">zzz</div>}
              </div>
            </div>

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
            <span /><span /><span />
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
