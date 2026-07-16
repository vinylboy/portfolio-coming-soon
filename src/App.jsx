import { useEffect, useRef, useState } from 'react'
import './styles.css'

const STATUS = {
  ACTIVE: 'ACTIVE',
  COPYING: 'COPYING',
  SLEEPING: 'SLEEPING',
}

const terminalLines = [
  ['root@portfolio:~$', 'initialize --presence'],
  ['system@ai-core:~$', '// status: building'],
  ['deploy@node-01:~$', 'next public release pending...'],
]

function App() {
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 })
  const [status, setStatus] = useState(STATUS.ACTIVE)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [typedLine, setTypedLine] = useState(0)
  const [typedChars, setTypedChars] = useState(0)

  const idleTimer = useRef(null)
  const copyTimer = useRef(null)
  const idle = useRef(false)

  useEffect(() => {
    const wake = () => {
      idle.current = false
      setStatus((current) => current === STATUS.COPYING ? current : STATUS.ACTIVE)

      clearTimeout(idleTimer.current)
      idleTimer.current = setTimeout(() => {
        idle.current = true
        setStatus((current) => current === STATUS.COPYING ? current : STATUS.SLEEPING)
      }, 6500)
    }

    const move = (event) => {
      setMouse({
        x: event.clientX / window.innerWidth,
        y: event.clientY / window.innerHeight,
      })
      wake()
    }

    const copy = () => {
      setStatus(STATUS.COPYING)
      clearTimeout(copyTimer.current)

      copyTimer.current = setTimeout(() => {
        setStatus(idle.current ? STATUS.SLEEPING : STATUS.ACTIVE)
      }, 1600)
    }

    wake()
    window.addEventListener('mousemove', move)
    window.addEventListener('click', wake)
    window.addEventListener('keydown', wake)
    window.addEventListener('scroll', wake)
    document.addEventListener('copy', copy)

    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('click', wake)
      window.removeEventListener('keydown', wake)
      window.removeEventListener('scroll', wake)
      document.removeEventListener('copy', copy)
      clearTimeout(idleTimer.current)
      clearTimeout(copyTimer.current)
    }
  }, [])

  useEffect(() => {
    if (typedLine >= terminalLines.length) return

    const command = terminalLines[typedLine][1]

    if (typedChars <= command.length) {
      const timer = setTimeout(() => setTypedChars((value) => value + 1), 38)
      return () => clearTimeout(timer)
    }

    const timer = setTimeout(() => {
      setTypedLine((value) => value + 1)
      setTypedChars(0)
    }, 350)

    return () => clearTimeout(timer)
  }, [typedLine, typedChars])

  const handleSubmit = (event) => {
    event.preventDefault()
    if (email.trim()) setSubmitted(true)
  }

  const sleeping = status === STATUS.SLEEPING
  const copying = status === STATUS.COPYING
  const eyeX = (mouse.x - 0.5) * 9
  const eyeY = (mouse.y - 0.5) * 7

  return (
    <div className="page">
      <div className="grid" />
      <div className="ambient ambient-top" />
      <div className="ambient ambient-bottom" />

      <nav className="nav">
        <div className="nav-pill">
          <span className="live-dot" />
          <span>AUTONOMOUS SYSTEMS</span>
          <i>/</i>
          <span>AI INFRASTRUCTURE</span>
        </div>
      </nav>

      <main className="content">
        <section className="intro">
          <div className={`robot ${sleeping ? 'is-sleeping' : ''} ${copying ? 'is-alert' : ''}`}>
            <div className="antenna">
              <span className="antenna-light" />
              <span className="antenna-wire" />
            </div>

            <div className="robot-head">
              <div className="robot-screen">
                <span
                  className="robot-eye"
                  style={sleeping ? undefined : { transform: `translate(${eyeX}px, ${eyeY}px)` }}
                />
                <span
                  className="robot-eye"
                  style={sleeping ? undefined : { transform: `translate(${eyeX}px, ${eyeY}px)` }}
                />
              </div>
              <div className="robot-mouth"><span /><span /><span /></div>
            </div>

            <div className="robot-neck" />

            <div className="robot-body">
              <span className="core" />
              <span className="body-line" />
            </div>

            {sleeping && <span className="zzz">zzz</span>}
          </div>

          <div className={`system-status ${copying ? 'alert' : ''}`}>
            <span />
            {status === STATUS.ACTIVE && '// status: building'}
            {status === STATUS.COPYING && '// retina override active'}
            {status === STATUS.SLEEPING && '// low-power sleep mode'}
          </div>
        </section>

        <section className="hero-copy">
          <h1>Coming <em>Soon</em></h1>
          <p>
            We are building the next layer of developer-focused intelligence
            <br className="desktop-break" />
            {' '}for fast-moving teams.
          </p>
        </section>

        <section className="signup">
          {!submitted ? (
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@company.com"
                aria-label="Email address"
                required
              />
              <button type="submit">Notify me</button>
            </form>
          ) : (
            <p className="success">✓ You are on the list.</p>
          )}

          <p className="join-count"><span /> <strong>216</strong> people already joined</p>
        </section>

        <section className="terminal" aria-label="System terminal">
          <div className="terminal-bar"><span /><span /><span /></div>
          <div className="terminal-content">
            {terminalLines.map(([prompt, command], index) => {
              if (index > typedLine) return null

              const text = index === typedLine
                ? command.slice(0, typedChars)
                : command

              return (
                <p key={prompt}>
                  <b>{prompt}</b> {text}
                  {index === typedLine && typedLine < terminalLines.length && (
                    <i className="cursor" />
                  )}
                </p>
              )
            })}
          </div>
        </section>

        <footer>
          <a href="https://github.com/vinylboy" target="_blank" rel="noreferrer" aria-label="GitHub">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.49 2 12.02c0 4.42 2.87 8.18 6.84 9.5.5.09.68-.22.68-.48v-1.7c-2.78.61-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03A9.55 9.55 0 0112 6.84c.85 0 1.69.11 2.5.34 1.91-1.3 2.75-1.03 2.75-1.03.54 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.85-2.34 4.69-4.57 4.94.36.31.68.92.68 1.86v2.75c0 .27.18.58.69.48A10.02 10.02 0 0022 12.02C22 6.49 17.52 2 12 2z" />
            </svg>
          </a>
          <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="X">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-4.71-6.23-5.4 6.23H2.75l7.73-8.84L1.25 2.25h6.83l4.25 5.62 5.91-5.62zm-1.16 17.52h1.83L7.08 4.13H5.12z" />
            </svg>
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 110-4.13 2.06 2.06 0 010 4.13zM7.12 20.45H3.56V9h3.56v11.45z" />
            </svg>
          </a>
        </footer>
      </main>
    </div>
  )
}

export default App
