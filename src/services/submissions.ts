import { supabase } from './supabase';

export interface PizzeriaSubmission {
  name: string;
  address: string;
  lat?: number;
  lng?: number;
  phone?: string;
  website?: string;
  google_maps_url?: string;
  style_id?: string;
  description?: string;
  submitter_email?: string;
}

/**
 * Submit a new pizzeria for review
 */
export async function submitPizzeria(submission: PizzeriaSubmission): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('pizzeria_submissions')
      .insert({
        ...submission,
        status: 'pending'
      });

    if (error) {
      console.error('Submission error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (e) {
    console.error('Submission failed:', e);
    return { success: false, error: 'Failed to submit. Please try again.' };
  }
}

/**
 * Get count of pending submissions (for admin display)
 */
export async function getPendingSubmissionsCount(): Promise<number> {
  const { count, error } = await supabase
    .from('pizzeria_submissions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending');

  if (error) {
    console.error('Error fetching pending count:', error);
    return 0;
  }

  return count || 0;
}
