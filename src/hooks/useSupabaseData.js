import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { format } from 'date-fns'

const today = () => format(new Date(), 'yyyy-MM-dd')

function defaultData() {
  return { goal: null, streak: 0, last_active: null, entries: {}, missions: [], devoirs: [], settings: {} }
}

export function useSupabaseData(userId) {
  const [data, setData] = useState(defaultData)
  const [loading, setLoading] = useState(true)
  const recordIdRef = useRef(null) // ref pour eviter les problemes de closure
  const saveTimer = useRef(null)
  const userIdRef = useRef(userId)

  useEffect(() => { userIdRef.current = userId }, [userId])

  useEffect(() => {
    if (!userId) return
    loadData()
  }, [userId])

  const loadData = async () => {
    setLoading(true)
    try {
      const { data: rows, error } = await supabase
        .from('goal_data')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error && error.code === 'PGRST116') {
        const { data: newRow } = await supabase
          .from('goal_data')
          .insert({ user_id: userId, ...defaultData() })
          .select()
          .single()
        if (newRow) {
          recordIdRef.current = newRow.id
          setData(defaultData())
        }
      } else if (rows) {
        recordIdRef.current = rows.id
        setData({
          goal: rows.goal,
          streak: rows.streak || 0,
          last_active: rows.last_active,
          entries: rows.entries || {},
          missions: rows.missions || [],
          devoirs: rows.devoirs || [],
          settings: rows.settings || {},
        })
      }
    } catch(e) {
      console.error('loadData error:', e)
    }
    setLoading(false)
  }

  // Save direct sans debounce pour les donnees critiques
  const saveImmediate = useCallback(async (newData) => {
    if (!userIdRef.current || !recordIdRef.current) return
    try {
      await supabase.from('goal_data').update({
        goal: newData.goal,
        streak: newData.streak,
        last_active: newData.last_active,
        entries: newData.entries,
        missions: newData.missions,
        devoirs: newData.devoirs,
        settings: newData.settings,
        updated_at: new Date().toISOString(),
      }).eq('id', recordIdRef.current)
    } catch(e) {
      console.error('save error:', e)
    }
  }, [])

  // Save avec debounce pour les updates frequents
  const save = useCallback((newData) => {
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => saveImmediate(newData), 800)
  }, [saveImmediate])

  const updateData = useCallback((patch) => {
    setData(prev => {
      const next = { ...prev, ...patch }
      save(next)
      return next
    })
  }, [save])

  const checkStreak = useCallback((d) => {
    const t = today()
    if (d.last_active === t) return d
    const yesterday = format(new Date(Date.now() - 86400000), 'yyyy-MM-dd')
    const newStreak = d.last_active === yesterday ? d.streak : 0
    return { ...d, streak: newStreak, last_active: t }
  }, [])

  const setGoal = useCallback((goal) => updateData({ goal }), [updateData])
  const resetGoal = useCallback(() => updateData({ goal: null, streak: 0, entries: {}, missions: [], devoirs: [] }), [updateData])

  const getTodayEntry = useCallback(() => {
    return data.entries[today()] || {}
  }, [data.entries])

  const updateEntry = useCallback((patch) => {
    const t = today()
    setData(prev => {
      const checked = checkStreak(prev)
      const next = {
        ...checked,
        entries: { ...checked.entries, [t]: { ...(checked.entries[t] || {}), ...patch } }
      }
      save(next)
      return next
    })
  }, [checkStreak, save])

  const toggleTask = useCallback((idx) => {
    const t = today()
    setData(prev => {
      const entry = prev.entries[t] || {}
      const tasks = [...(entry.tasks || [])]
      tasks[idx] = !tasks[idx]
      const next = { ...prev, entries: { ...prev.entries, [t]: { ...entry, tasks } } }
      save(next)
      return next
    })
  }, [save])

  const updateMissions = useCallback((missions) => updateData({ missions }), [updateData])
  const updateDevoirs = useCallback((devoirs) => updateData({ devoirs }), [updateData])
  const updateNotifications = useCallback((notifs) => {
    updateData({ settings: { ...data.settings, ...notifs } })
  }, [updateData, data.settings])

  return {
    data, loading,
    today: today(),
    setGoal, resetGoal,
    getTodayEntry, updateEntry, toggleTask,
    updateMissions, updateDevoirs, updateNotifications,
    reload: loadData,
  }
}