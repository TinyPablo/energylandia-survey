import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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

const schema = z.object({
  albumNumber: z.string().regex(/^\d{4,6}$/, 'Musi mieć 4-6 cyfr'),
  fullName: z.string().min(1, 'Podaj imię i nazwisko'),
  selectedDates: z.array(z.string()).min(1, 'Zaznacz co najmniej jeden termin'),
  transport: z.string().min(1, 'Wybierz opcję transportu'),
  seats: z.string().optional(),
})

type FormFields = z.infer<typeof schema>

function App() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormFields>({
    defaultValues: {
      selectedDates: [],
      transport: '',
    },
    resolver: zodResolver(schema),
  })

  const transport = useWatch({ control, name: 'transport' })

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pl-PL', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    })
  }

  const onSubmit = (data: FormFields) => {
    console.log(data)
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
          </div>

          <div className="form-section">
            <label htmlFor="full-name">Imię i Nazwisko</label>
            <input
              placeholder="np. Jan Kowalski"
              type="text"
              {...register('fullName')}
            />
            {errors.fullName && (
              <small style={{ color: 'red' }}>{errors.fullName.message}</small>
            )}
          </div>

          <div className="form-section">
            <p>Zaznacz terminy które Ci nie przeszkadzają:</p>
            {SUNDAYS.map((date) => (
              <label key={date}>
                <input
                  type="checkbox"
                  {...register('selectedDates')}
                  value={date}
                />
                {formatDate(date)}
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
                <label htmlFor="seats">Liczba miejsc</label>
                <input
                  placeholder="1-8"
                  type="number"
                  id="seats"
                  {...register('seats')}
                />
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
          <button type="submit">Wyślij ankietę</button>
        </form>
      </article>
    </main>
  )
}

export default App
