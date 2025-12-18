'use client'

import { useEffect, useState } from 'react'
import { useSupabase } from '@/components/SupabaseProvider'
import { RealtimeChannel } from '@supabase/supabase-js'

export const useSupabaseRealtime = <T = any>(
  table: string,
  filter?: string
) => {
  const { supabase } = useSupabase()
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let channel: RealtimeChannel

    const setupRealtime = async () => {
      // Initial fetch
      const { data: initialData, error } = await supabase
        .from(table)
        .select('*')

      if (error) {
        console.error('Error fetching initial data:', error)
      } else {
        setData(initialData || [])
      }
      setLoading(false)

      // Set up real-time subscription
      channel = supabase
        .channel(`${table}_changes`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: table,
            filter: filter,
          },
          (payload) => {
            console.log('Real-time update:', payload)
            
            if (payload.eventType === 'INSERT') {
              setData(prev => [...prev, payload.new as T])
            } else if (payload.eventType === 'UPDATE') {
              setData(prev => 
                prev.map(item => 
                  (item as any).id === (payload.new as any).id 
                    ? payload.new as T 
                    : item
                )
              )
            } else if (payload.eventType === 'DELETE') {
              setData(prev => 
                prev.filter(item => (item as any).id !== (payload.old as any).id)
              )
            }
          }
        )
        .subscribe()
    }

    setupRealtime()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [supabase, table, filter])

  return { data, loading }
}