// components/Login.jsx
import { useState } from 'react'

export function Login({ onLogin }) {
  const [input, setInput] = useState('')

  const handleLogin = async () => {
    const url = 'https://script.google.com/macros/s/AKfycbxCoUAl42L5S4Zvz43kmTi5JDH8PBCB2iNP5H0vdMWm1Bn__q5oDG6A6sKNJwvrYtRkqg/exec?action=getAdminPass'
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
