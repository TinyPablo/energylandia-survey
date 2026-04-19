import { useState } from 'react'

function App() {
  const [albumNumber, setAlbumNumber] = useState('')
  const [fullName, setFullName] = useState('')
  const [selectedDates, setSelectedDates] = useState<string[]>([])

  const sundays = [
    '2026-05-03',
    '2026-05-10',
    '2026-05-17',
    '2026-05-24',
    '2026-05-31',
    '2026-06-07',
    '2026-06-14',
    '2026-06-21',
    '2026-06-28',
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <main className="container">
      <article>
        <h1>Ankieta Energylandia WSIZ</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="">Numer albumu</label>
          <input
            type="text"
            value={albumNumber}
            onChange={(e) => setAlbumNumber(e.target.value)}
          />
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          {sundays.map((date) => (
            <label key={date}>
              <input type="checkbox" value={date} />
              {date}
            </label>
          ))}
        </form>
      </article>
    </main>
  )
}

export default App
