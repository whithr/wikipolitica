import { useState, useEffect } from 'react'
import { createLazyFileRoute } from '@tanstack/react-router'
import { createClient } from '@supabase/supabase-js'
import { Database, Tables } from '@/lib/database.types'

export const Route = createLazyFileRoute('/countries')({
  component: Country,
})

const supabase = createClient<Database>(
  'https://syuiizinwoqmdgqziyyr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5dWlpemlud29xbWRncXppeXlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc2MTUwMTYsImV4cCI6MjA1MzE5MTAxNn0.QuFIM9-quiQv-Qtu25gisUYsDSYFcHRqMY8nnKrk_C8'
)

function Country() {
  const [countries, setCountries] = useState<Tables<'countries'>[] | null>(null)

  useEffect(() => {
    getCountries()
  }, [])

  async function getCountries() {
    const { data } = await supabase.from('countries').select()
    setCountries(data || null)
  }

  return (
    <ul>
      {countries?.map((country) => <li key={country.name}>{country.name}</li>)}
    </ul>
  )
}
