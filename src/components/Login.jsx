import { useState } from 'react'

export function Login({ onLogin }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async () => {
    const res = await fetch('https://script.google.com/macros/s/AKfycbybK3Vobo8b5sb8Lo4fgHs9atBxBeaan40O42W0ZfHWVAcI3w2mJjPDtY9A5AaSi-wl7A/exec?action=getSettings')
    const data = await res.json()
    const correctPassword = data.admin_pass

    if (password === correctPassword) {
      onLogin(true)
    } else {
      setError('Неверный пароль')
    }
  }

  return (
    <div className="mt-6 border-t pt-4">
      <h2 className="text-lg font-semibold mb-2">Вход в админку</h2>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Введите пароль"
        className="border p-2 mr-2"
      />
      <button onClick={handleLogin} className="bg-blue-600 text-white px-4 py-2 rounded">Войти</button>
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </div>
  )
}
