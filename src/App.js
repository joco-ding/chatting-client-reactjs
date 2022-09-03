import './App.css';
import { useState } from 'react';
import { useRef } from 'react';
import { useCallback } from 'react';
import { useEffect } from 'react';

const ENDPOIN = 'ws://localhost:8083/ws'
let wsclient = new WebSocket(ENDPOIN)

function App() {
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')
  const bottomMsgRef = useRef(null)

  useEffect(() => {
    wsclient.onopen = () => {
      console.log(`Websocket ${ENDPOIN} berhasil terhubung`)
    }

    wsclient.onmessage = (event) => {
      console.log(`message: ${event.data}`)
      setMessages(current => [
        ...current,
        event.data
      ])
    }
  }, [])

  const kirimPesan = useCallback(() => {
    if (message !== '') {
      wsclient.send(message)
      setMessages(current => [
        ...current,
        `[me] ${message}`
      ])
      setMessage('')
    }
  }, [message])

  useEffect(() => {
    bottomMsg.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages]);

  const handleChange = event => {
    setMessage(event.target.value)
  }

  useEffect(() => {
    const keydownHandler = event => {
      if (event.key === 'Enter') {
        event.preventDefault()
        kirimPesan()
      }
    }
    document.addEventListener('keydown', keydownHandler)
    return () => {
      document.removeEventListener('keydown', keydownHandler)
    }
  }, [kirimPesan])

  return (
    <>
      <header>
        <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
          <div className='container'>
            <span className="navbar-brand">Chatting Client</span>
          </div>
        </nav>
      </header>
      <main className='container' style={{ marginTop: '70px' }}>
        {messages.map((m, idx) => {
          return <div key={idx}>{m}</div>
        })}
        <div ref={bottomMsgRef} style={{ marginBottom: '70px' }}></div>
      </main>
      <footer>
        <nav className="navbar navbar-expand-md fixed-bottom bg-white container">
          <div className="input-group mb-3">
            <input type="text" className="form-control" placeholder="" onChange={handleChange} value={message} aria-label="Example text with button addon" aria-describedby="button-addon1" />
            <button className="btn btn-outline-secondary" type="button" id="button-addon1" onClick={kirimPesan}>Kirim</button>
          </div>
        </nav>
      </footer>
    </>
  );
}

export default App;
