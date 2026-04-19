import { useState } from 'react'
import './App.css'

const SUNDAYS = [
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

function App() {
  const [albumNumber, setAlbumNumber] = useState('')
  const [fullName, setFullName] = useState('')
  const [selectedDates, setSelectedDates] = useState<string[]>([])
  const [transport, setTransport] = useState('')
  const [seats, setSeats] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Record<string, string> = {}

    if (!/^\d{4,6}$/.test(albumNumber)) {
      newErrors.albumNumber = 'Numer albumu musi mieć 4-6 cyfr'
    }

    if (fullName.trim() === '') {
      newErrors.fullName = 'Podaj imię i nazwisko'
    }

    if (selectedDates.length === 0) {
      newErrors.selectedDates = 'Zaznacz co najmniej jeden termin'
    }

    if (transport === '') {
      newErrors.transport = 'Wybierz opcję transportu'
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) return
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pl-PL', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    })
  }

  return (
    <main className="container">
      <article
        style={{ maxWidth: '480px', margin: '0 auto', textAlign: 'left' }}
      >
        <h1 style={{ textAlign: 'center' }}>Ankieta Energylandia WSIZ</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <label htmlFor="album-number">Numer albumu</label>
            <input
              placeholder="np. 1234"
              id="album-number"
              type="text"
              value={albumNumber}
              onChange={(e) => {
                setAlbumNumber(e.target.value)
                clearError('albumNumber')
              }}
            />
            {errors.albumNumber && (
              <small style={{ color: 'red' }}>{errors.albumNumber}</small>
            )}
          </div>

          <div className="form-section">
            <label htmlFor="full-name">Imię i Nazwisko</label>
            <input
              placeholder="np. Jan Kowalski"
              id="full-name"
              type="text"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value)
                clearError('fullName')
              }}
            />
            {errors.fullName && (
              <small style={{ color: 'red' }}>{errors.fullName}</small>
            )}
          </div>

          <div className="form-section">
            <p>Zaznacz terminy które Ci nie przeszkadzają:</p>
            {SUNDAYS.map((date) => (
              <label key={date}>
                <input
                  type="checkbox"
                  value={date}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedDates([...selectedDates, date])
                    } else {
                      setSelectedDates(selectedDates.filter((d) => d !== date))
                    }
                    clearError('selectedDates')
                  }}
                />
                {formatDate(date)}
              </label>
            ))}
            {errors.selectedDates && (
              <small style={{ color: 'red' }}>{errors.selectedDates}</small>
            )}
          </div>

          <div className="form-section">
            <p>Transport:</p>

            <label htmlFor="driver">
              <input
                id="driver"
                type="radio"
                name="transport"
                value="driver"
                onChange={(e) => {
                  setTransport(e.target.value)
                  clearError('transport')
                }}
              />
              Jadę autem
            </label>
            {transport === 'driver' && (
              <>
                <label htmlFor="seats">Liczba miejsc</label>
                <input
                  placeholder="1-8"
                  type="number"
                  id="seats"
                  value={seats}
                  onChange={(e) => {
                    setSeats(e.target.value)
                    clearError('transport')
                  }}
                  min={1}
                  max={8}
                />
              </>
            )}

            <label htmlFor="no-car">
              <input
                id="no-car"
                type="radio"
                name="transport"
                value="no-car"
                onChange={(e) => {
                  setTransport(e.target.value)
                  clearError('transport')
                }}
              />
              Nie jadę autem, dam radę
            </label>

            <label htmlFor="needs-ride">
              <input
                id="needs-ride"
                type="radio"
                name="transport"
                value="needs-ride"
                onChange={(e) => {
                  setTransport(e.target.value)
                  clearError('transport')
                }}
              />
              Potrzebuję podwózki
            </label>
            {errors.transport && (
              <small style={{ color: 'red' }}>{errors.transport}</small>
            )}
          </div>
          <button type="submit">Wyślij ankietę</button>
        </form>
      </article>
    </main>
  )
}

export default App
