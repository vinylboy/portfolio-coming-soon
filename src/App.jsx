import { useEffect, useRef, useState } from 'react'
import Spline from '@splinetool/react-spline'
import './styles.css'

const SCENE_URL =
  'https://prod.spline.design/Rhsi3Tj9iX30Q6UJ/scene.splinecode'

const STATUS = {
  ACTIVE: 'ACTIVE',
  COPYING: 'COPYING',
  SLEEPING: 'SLEEPING',
}

function App() {
  const [status, setStatus] = useState(STATUS.ACTIVE)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [sceneReady, setSceneReady] = useState(false)

  const idleTimer = useRef(null)
  const copyTimer = useRef(null)
  const isIdle = useRef(false)

  useEffect(() => {
    const wakeUp = () => {
      isIdle.current = false
      setStatus((current) =>
        current === STATUS.COPYING ? current : STATUS.ACTIVE,
      )

      clearTimeout(idleTimer.current)

      idleTimer.current = setTimeout(() => {
        isIdle.current = true
        setStatus((current) =>
          current === STATUS.COPYING ? current : STATUS.SLEEPING,
        )
      }, 8000)
    }

    const copied = () => {
      setStatus(STATUS.COPYING)
      clearTimeout(copyTimer.current)

      copyTimer.current = setTimeout(() => {
        setStatus(isIdle.current ? STATUS.SLEEPING : STATUS.ACTIVE)
      }, 1800)
    }

    wakeUp()

    window.addEventListener('mousemove', wakeUp)
    window.addEventListener('click', wakeUp)
    window.addEventListener('keydown', wakeUp)
    window.addEventListener('scroll', wakeUp)
    document.addEventListener('copy', copied)

    return () => {
      window.removeEventListener('mousemove', wakeUp)
      window.removeEventListener('click', wakeUp)
      window.removeEventListener('keydown', wakeUp)
      window.removeEventListener('scroll', wakeUp)
      document.removeEventListener('copy', copied)
      clearTimeout(idleTimer.current)
      clearTimeout(copyTimer.current)
    }
  }, [])

  const submit = (event) => {
    event.preventDefault()
    if (email.trim()) setSubmitted(true)
  }

  return (
    <main className="site">
      <div className="grid-background" />

      <nav className="navbar">
        <div className="nav-brand">
          <span className="live-indicator" />
          <span>AUTONOMOUS SYSTEMS</span>
          <b>/</b>
          <span>AI INFRASTRUCTURE</span>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <p className="overline">PORTFOLIO // UNDER CONSTRUCTION</p>

          <h1>
            BUILDING THE<br />
            <span>INTELLIGENT</span> FUTURE.
          </h1>

          <p className="description">
            Autonomous systems, AI infrastructure and production-grade tools
            for high-performance digital operations.
          </p>
        </div>

        <div className="robot-zone">
          <div className="robot-aura" />

          {!sceneReady && (
            <div className="robot-loading">
              <span className="loading-dot" />
              LOADING 3D SYSTEM...
            </div>
          )}

          <Spline
            className="spline-robot"
            scene={SCENE_URL}
            onLoad={() => setSceneReady(true)}
          />

          <div className={`robot-state ${status.toLowerCase()}`}>
            <span />
            {status === STATUS.ACTIVE && '// status: building'}
            {status === STATUS.COPYING && '// copy detected: alert mode'}
            {status === STATUS.SLEEPING && '// low-power mode: zzz'}
          </div>
        </div>
      </section>

      <section className="bottom-area">
        <div className="signup-panel">
          <p>GET THE DEPLOYMENT SIGNAL</p>

          {!submitted ? (
            <form onSubmit={submit}>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                placeholder="you@company.com"
                required
              />
              <button type="submit">Notify me</button>
            </form>
          ) : (
            <p className="success">✓ You are on the priority list.</p>
          )}

          <small>
            <span /> 216 people already joined
          </small>
        </div>

        <div className="terminal">
          <div className="terminal-header">
            <span />
            <span />
            <span />
            <b>AI-CORE / TERMINAL</b>
          </div>

          <div className="terminal-content">
            <p>
              <strong>root@portfolio:~$</strong> initialize --presence
            </p>
            <p>
              <strong>system@ai-core:~$</strong> // status: building
            </p>
            <p>
              <strong>deploy@node-01:~$</strong> next public release pending...
              <i />
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default App