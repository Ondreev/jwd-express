import { useState, useEffect } from 'react'

export function Login({ onLogin }) {
  const [inputPass, setInputPass] = useState("")
  const [correctPass, setCorrectPass] = useState("")

  useEffect(() => {
    fetch("https://script.google.com/macros/s/AKfycbzett_XldBVHYcnoAIcg_2cO6QFoPgLT88UWjlOThalmrddOhLgMVghRViAZvlDSykqWQ/exec?action=getAdminPass")
      .then(res => res.text())
      .then(setCorrectPass)
  }, [])

  const handleLogin = () => {
    if (inputPass === correctPass) {
      onLogin(true)
    } else {
      alert("Неверный пароль")
    }
  }

  return (
    <div className="p-4 max-w-sm mx-auto">
      <h2 className="text-lg font-bold mb-4">Вход в админку</h2>
      <input
        type="password"
        value={inputPass}
        onChange={(e) => setInputPass(e.target.value)}
        placeholder="Введите пароль"
        className="border p-2 w-full mb-2"
      />
      <button
        onClick={handleLogin}
        className="bg-black text-white px-4 py-2 w-full"
      >
        Войти
      </button>
    </div>
  )
}
