import { Component, useEffect, useRef, useState } from 'react'
import Spline from '@splinetool/react-spline'
import './styles.css'

const SCENE_URL = 'https://prod.spline.design/Rhsi3Tj9iX30Q6UJ/scene.splinecode'

const LOGS = [
  'orchestrating autonomous execution graph...',
  'AI inference gateway: healthy',
  'indexing semantic memory vectors...',
  'deploying edge worker to eu-central-1...',
  'optimizing token routing policy...',
  'event stream: no anomalies detected',
  'compiling automation layer...',
  'synchronizing intelligence store...',
  'warming production model cache...',
  'integrity verification: passed',
  'mapping agent tools to capability registry...',
  'latency budget: within threshold',
  'initializing deployment pipeline...',
  'strategy signal received: adapting...',
  'neural scheduler: optimizing workload...',
  'vector retrieval: cache hit 98.7%',
]

class SplineBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error) {
    console.warn('Spline scene failed safely:', error)
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="robot-fallback">
          <div className="fallback-orb">
            <span />
            <span />
          </div>
          <strong>3D SYSTEM STANDBY</strong>
          <small>VISUAL RUNTIME TEMPORARILY OFFLINE</small>
        </div>
      )
    }

    return this.props.children
  }
}

function LiveTerminal() {
  const [rows, setRows] = useState([])
  const [typing, setTyping] = useState('')
  const messageRef = useRef(0)

  useEffect(() => {
    let cancelled = false
    let timeout

    const next = () => {
      if (cancelled) return

      const message = LOGS[messageRef.current]
      let index = 0

      const write = () => {
        if (cancelled) return

        setTyping(message.slice(0, index))
        index += 1

        if (index <= message.length) {
          timeout = setTimeout(write, 18 + Math.random() * 18)
          return
        }

        timeout = setTimeout(() => {
          if (cancelled) return

          setRows((current) => [
            ...current.slice(-4),
            { id: `${Date.now()}-${messageRef.current}`, message },
          ])

          setTyping('')
          messageRef.current =
            (messageRef.current + 1 + Math.floor(Math.random() * 3)) %
            LOGS.length

          timeout = setTimeout(next, 450)
        }, 800)
      }

      write()
    }

    next()

    return () => {
      cancelled = true
      clearTimeout(timeout)
    }
  }, [])

  return (
    <section className="terminal" aria-label="Live AI system terminal">
      <div className="terminal-bar">
        <div className="terminal-lights"><span /><span /><span /></div>
        <p>LIVE / AI-CORE TERMINAL</p>
        <b><i /> STREAMING</b>
      </div>

      <div className="terminal-body">
        <p>
          <strong>root@portfolio:~$</strong>
          <span> boot autonomous-stack --production</span>
        </p>

        {rows.map((row) => (
          <p key={row.id}>
            <strong>system@ai-core:~$</strong>
            <span> {row.message}</span>
          </p>
        ))}

        <p className="typing-row">
          <strong>agent@runtime:~$</strong>
          <span> {typing}</span>
          <i />
        </p>
      </div>
    </section>
  )
}

function App() {
  const [status, setStatus] = useState('ACTIVE')
  const [loaded, setLoaded] = useState(false)
  const idleTimer = useRef(null)
  const copyTimer = useRef(null)
  const isIdle = useRef(false)

  useEffect(() => {
    const wake = () => {
      isIdle.current = false
      setStatus((current) => current === 'COPYING' ? current : 'ACTIVE')

      clearTimeout(idleTimer.current)
      idleTimer.current = setTimeout(() => {
        isIdle.current = true
        setStatus((current) => current === 'COPYING' ? current : 'SLEEPING')
      }, 12000)
    }

    const copied = () => {
      setStatus('COPYING')
      clearTimeout(copyTimer.current)

      copyTimer.current = setTimeout(() => {
        setStatus(isIdle.current ? 'SLEEPING' : 'ACTIVE')
      }, 1600)
    }

    wake()
    window.addEventListener('mousemove', wake, { passive: true })
    window.addEventListener('keydown', wake)
    window.addEventListener('click', wake)
    window.addEventListener('scroll', wake, { passive: true })
    document.addEventListener('copy', copied)

    return () => {
      window.removeEventListener('mousemove', wake)
      window.removeEventListener('keydown', wake)
      window.removeEventListener('click', wake)
      window.removeEventListener('scroll', wake)
      document.removeEventListener('copy', copied)
      clearTimeout(idleTimer.current)
      clearTimeout(copyTimer.current)
    }
  }, [])

  const statusText = {
    ACTIVE: '// status: building',
    COPYING: '// copy detected: alert mode',
    SLEEPING: '// idle mode: dreaming in vectors',
  }[status]

  return (
    <main className="site">
      <div className="grid-bg" />
      <div className="orb orb-one" />
      <div className="orb orb-two" />

      <header className="header">
        <div className="brand">
          <span />
          <b>AUTONOMOUS SYSTEMS</b>
          <i>/</i>
          <b>AI INFRASTRUCTURE</b>
        </div>
      </header>

      <section className="hero">
        <p className="eyebrow">PORTFOLIO INTERFACE // ONLINE</p>

        <div className="robot-stage">
          <div className="robot-aura" />

          {!loaded && (
            <div className="loader">
              <span />
              INITIALIZING 3D SYSTEM
            </div>
          )}

          <SplineBoundary>
            <Spline
              className="spline"
              scene={SCENE_URL}
              onLoad={() => setLoaded(true)}
            />
          </SplineBoundary>

          <div className={`robot-state ${status.toLowerCase()}`}>
            <span />
            {statusText}
          </div>
        </div>

        <div className="coming-soon">
          <h1>Coming <em>Soon</em></h1>
          <p>
            Building autonomous systems, intelligent infrastructure
            <br />
            and production-grade AI operations.
          </p>
        </div>

        <a
          className="github"
          href="https://github.com/vinylboy"
          target="_blank"
          rel="noreferrer"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C6.48 2 2 6.49 2 12.02c0 4.42 2.87 8.18 6.84 9.5.5.09.68-.22.68-.48v-1.7c-2.78.61-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03A9.55 9.55 0 0112 6.84c.85 0 1.69.11 2.5.34 1.91-1.3 2.75-1.03 2.75-1.03.54 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.85-2.34 4.69-4.57 4.94.36.31.68.92.68 1.86v2.75c0 .27.18.58.69.48A10.02 10.02 0 0022 12.02C22 6.49 17.52 2 12 2z" />
          </svg>
          VIEW SYSTEMS ON GITHUB <b>↗</b>
        </a>
      </section>

      <LiveTerminal />

      <footer>
        <span /> SYSTEMS IN DEVELOPMENT <i>•</i> STUTTGART / DE
      </footer>
    </main>
  )
}

export default App
