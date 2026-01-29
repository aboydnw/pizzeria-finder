import { supabase } from './supabase';

export interface PizzeriaSubmission {
  id?: string; // For updates
  name: string;
  address: string;
  lat?: number;
  lng?: number;
  phone?: string;
  website?: string;
  google_maps_url?: string;
  style_id?: string;
  description?: string;
}

// Portland city ID (hardcoded for now since we only support Portland)
const PORTLAND_CITY_ID = '5f835ff7-1600-4979-9688-1935bfb98c2c';

/**
 * Submit a new pizzeria - adds directly to the map
 */
export async function submitPizzeria(submission: PizzeriaSubmission): Promise<{ success: boolean; error?: string; pizzeriaId?: string }> {
  try {
    // First, insert the pizzeria
    const { data: pizzeria, error: pizzeriaError } = await supabase
      .from('pizzerias')
      .insert({
        city_id: PORTLAND_CITY_ID,
        name: submission.name,
        address: submission.address,
        lat: submission.lat || 45.5152, // Default to Portland center if no coords
        lng: submission.lng || -122.6784,
        phone: submission.phone || null,
        website: submission.website || null,
        google_maps_url: submission.google_maps_url || null,
        description: submission.description || null,
      })
      .select('id')
      .single();

    if (pizzeriaError) {
      console.error('Pizzeria insert error:', pizzeriaError);
      return { success: false, error: pizzeriaError.message };
    }

    // Then, if a style was selected, create the pizzeria_style relationship
    if (submission.style_id && pizzeria?.id) {
      const { error: styleError } = await supabase
        .from('pizzeria_styles')
        .insert({
          pizzeria_id: pizzeria.id,
          style_id: submission.style_id,
          is_primary: true,
        });

      if (styleError) {
        console.error('Style link error:', styleError);
        // Don't fail the whole submission, just log it
      }
    }

    return { success: true, pizzeriaId: pizzeria?.id };
  } catch (e) {
    console.error('Submission failed:', e);
    return { success: false, error: 'Failed to submit. Please try again.' };
  }
}

/**
 * Update an existing pizzeria
 */
export async function updatePizzeria(submission: PizzeriaSubmission): Promise<{ success: boolean; error?: string }> {
  if (!submission.id) {
    return { success: false, error: 'No pizzeria ID provided' };
  }

  try {
    // Update the pizzeria
    const { error: pizzeriaError } = await supabase
      .from('pizzerias')
      .update({
        name: submission.name,
        address: submission.address,
        lat: submission.lat,
        lng: submission.lng,
        phone: submission.phone || null,
        website: submission.website || null,
        google_maps_url: submission.google_maps_url || null,
        description: submission.description || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', submission.id);

    if (pizzeriaError) {
      console.error('Pizzeria update error:', pizzeriaError);
      return { success: false, error: pizzeriaError.message };
    }

    // Update the style if provided
    if (submission.style_id) {
      // First, delete existing style associations
      await supabase
        .from('pizzeria_styles')
        .delete()
        .eq('pizzeria_id', submission.id);

      // Then create the new one
      const { error: styleError } = await supabase
        .from('pizzeria_styles')
        .insert({
          pizzeria_id: submission.id,
          style_id: submission.style_id,
          is_primary: true,
        });

      if (styleError) {
        console.error('Style update error:', styleError);
        // Don't fail the whole update, just log it
      }
    }

    return { success: true };
  } catch (e) {
    console.error('Update failed:', e);
    return { success: false, error: 'Failed to update. Please try again.' };
  }
}
