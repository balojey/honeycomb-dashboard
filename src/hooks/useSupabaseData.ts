'use client'

import { useState, useEffect } from 'react'
import { useSupabase } from '@/components/SupabaseProvider'

export const useSupabaseData = <T = any>(
  table: string,
  select: string = '*',
  filters?: Record<string, any>
) => {
  const { supabase } = useSupabase()
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)

      try {
        let query = supabase.from(table).select(select)

        // Apply filters if provided
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            query = query.eq(key, value)
          })
        }

        const { data: result, error } = await query

        if (error) {
          setError(error.message)
        } else {
          setData((result as T[]) || [])
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [supabase, table, select, JSON.stringify(filters)])

  const insert = async (values: Partial<T>) => {
    const { data, error } = await supabase
      .from(table)
      .insert(values)
      .select()

    if (error) {
      throw new Error(error.message)
    }

    return data
  }

  const update = async (id: string | number, values: Partial<T>) => {
    const { data, error } = await supabase
      .from(table)
      .update(values)
      .eq('id', id)
      .select()

    if (error) {
      throw new Error(error.message)
    }

    return data
  }

  const remove = async (id: string | number) => {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(error.message)
    }
  }

  const refetch = () => {
    setLoading(true)
    // This will trigger the useEffect to refetch data
  }

  return {
    data,
    loading,
    error,
    insert,
    update,
    remove,
    refetch,
  }
}