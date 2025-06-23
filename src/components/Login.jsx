// components/Login.jsx
import { useState } from 'react'

export function Login({ onLogin }) {
  const [input, setInput] = useState('')

  const handleLogin = async () => {
    const url = 'https://script.google.com/macros/s/AKfycbybK3Vobo8b5sb8Lo4fgHs9atBxBeaan40O42W0ZfHWVAcI3w2mJjPDtY9A5AaSi-wl7A/exec?action=getAdminPass'
    const res = await fetch(url)
    const realPass = await res.text()
    if (input === realPass) {
      onLogin(true)
    } else {
      alert('Неверный пароль')
    }
  }

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-2">Вход для администратора</h2>
      <input
        className="border rounded p-1 mr-2"
        type="password"
        placeholder="Введите пароль"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        className="bg-black text-white rounded px-3 py-1"
        onClick={handleLogin}
      >
        Войти
      </button>
    </div>
  )
}
