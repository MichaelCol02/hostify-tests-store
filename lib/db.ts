import { supabase } from './supabase'

export async function getUserPurchases(userId: string) {
  const { data, error } = await supabase
    .from('purchases')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'completed')

  if (error) throw error
  return data
}

export async function checkTestAccess(userId: string, testId: string) {
  const { data, error } = await supabase
    .from('purchases')
    .select('id')
    .eq('user_id', userId)
    .eq('test_id', testId)
    .eq('status', 'completed')
    .single()

  if (error && error.code === 'PGRST116') return false
  if (error) throw error
  return !!data
}

export async function getTestResults(userId: string) {
  const { data, error } = await supabase
    .from('test_results')
    .select('*')
    .eq('user_id', userId)

  if (error) throw error
  return data
}
