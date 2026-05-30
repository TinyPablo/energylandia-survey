import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import './App.css'
import { useEffect, useState } from 'react'

const SUNDAYS = [
  { value: '2026-06-07', label: 'tydzień II' },
  { value: '2026-06-14', label: 'tydzień III' },
  { value: '2026-06-21', label: 'tydzień IV' },
  { value: '2026-06-28', label: 'tydzień V' },
]

const schema = z
  .object({
    albumNumber: z.string().regex(/^\d{4}$/, 'Musi mieć 4 cyfry'),
    fullName: z.string().min(1, 'Podaj imię i nazwisko'),
    selectedDates: z
      .array(z.string())
      .min(1, 'Zaznacz co najmniej jeden termin'),
    transport: z.string().min(1, 'Wybierz opcję transportu'),
    seats: z
      .number()
      .int()
      .min(0, 'Min. 0 miejsc')
      .max(8, 'Max. 8 miejsc')
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.transport === 'driver' && data.seats === undefined) {
      ctx.addIssue({
        code: 'custom',
        path: ['seats'],
        message: 'Podaj liczbę miejsc',
      })
    }
  })

type FormFields = z.infer<typeof schema>

function App() {
  const [albumExists, setAlbumExists] = useState(false)
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<FormFields>({
    defaultValues: {
      selectedDates: [],
      transport: '',
    },
    resolver: zodResolver(schema),
  })

  const albumNumber = useWatch({ control, name: 'albumNumber' })
  const transport = useWatch({ control, name: 'transport' })

  useEffect(() => {
    if (!albumNumber || !/^\d{4,6}$/.test(albumNumber)) return
    fetch(`/api/check-album/${albumNumber}`)
      .then((r) => r.json())
      .then((data) => setAlbumExists(data.exists))
      .catch(() => setAlbumExists(false))
  }, [albumNumber])

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pl-PL', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    })
  }

  const onSubmit = async (data: FormFields) => {
    const response = await fetch(`/api/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Błąd serwera')
    await response.json()
  }

  return (
    <main className="container">
      <article
        style={{ maxWidth: '480px', margin: '0 auto', textAlign: 'left' }}
      >
        <h1 style={{ textAlign: 'center' }}>Ankieta Energylandia WSIZ</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-section">
            <label htmlFor="album-number">Numer albumu</label>
            <input
              placeholder="np. 1234"
              id="album-number"
              type="text"
              {...register('albumNumber')}
            />
            {errors.albumNumber && (
              <small style={{ color: 'red' }}>
                {errors.albumNumber.message}
              </small>
            )}
            {albumExists && (
              <small style={{ color: 'orange' }}>
                Ten numer albumu już istnieje — wysłanie nadpisze poprzednią
                odpowiedź.
              </small>
            )}
          </div>

          <div className="form-section">
            <label htmlFor="full-name">Imię i Nazwisko</label>
            <input
              placeholder="np. Jan Kowalski"
              type="text"
              id="full-name"
              {...register('fullName')}
            />
            {errors.fullName && (
              <small style={{ color: 'red' }}>{errors.fullName.message}</small>
            )}
          </div>

          <div className="form-section">
            <p>Zaznacz terminy które Ci nie przeszkadzają:</p>
            {SUNDAYS.map(({ value, label }) => (
              <label key={value}>
                <input
                  type="checkbox"
                  {...register('selectedDates')}
                  value={value}
                />
                {formatDate(value)} ({label})
              </label>
            ))}
            {errors.selectedDates && (
              <small style={{ color: 'red' }}>
                {errors.selectedDates.message}
              </small>
            )}
          </div>

          <div className="form-section">
            <p>Transport:</p>

            <label htmlFor="driver">
              <input
                id="driver"
                value="driver"
                type="radio"
                {...register('transport')}
              />
              Jadę autem
            </label>
            {transport === 'driver' && (
              <>
                <label htmlFor="seats">
                  Liczba wolnych miejsc (0 = nie zabieram nikogo)
                </label>
                <input
                  placeholder="0-8"
                  type="number"
                  id="seats"
                  min={0}
                  max={8}
                  step={1}
                  {...register('seats', {
                    setValueAs: (value) =>
                      value === '' ? undefined : Number(value),
                  })}
                />
                {errors.seats && (
                  <small style={{ color: 'red' }}>{errors.seats.message}</small>
                )}
              </>
            )}

            <label htmlFor="no-car">
              <input
                id="no-car"
                value="no-car"
                type="radio"
                {...register('transport')}
              />
              Nie jadę autem, dam radę
            </label>

            <label htmlFor="needs-ride">
              <input
                id="needs-ride"
                value="needs-ride"
                type="radio"
                {...register('transport')}
              />
              Potrzebuję podwózki
            </label>
            {errors.transport && (
              <small style={{ color: 'red' }}>{errors.transport.message}</small>
            )}
          </div>
          <button disabled={isSubmitting}>
            {isSubmitting ? 'Wysyłanie...' : 'Wyślij ankietę'}
          </button>
          {isSubmitSuccessful && <p>Dziękujemy za wypełnienie ankiety!</p>}
        </form>
      </article>
    </main>
  )
}

export default App
