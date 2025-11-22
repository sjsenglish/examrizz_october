import { supabase } from './supabase';

/**
 * Create a new question pack
 * @param {Object} packData - The question pack data
 * @param {string} packData.name - Pack name
 * @param {string} packData.subject - Subject (TSA, BMAT, Maths)
 * @param {string[]} packData.questionIds - Array of Algolia question objectIDs
 * @param {Object} packData.settings - Pack settings (fontSize, orderMode, filters)
 * @returns {Object} { success: boolean, pack?: object, error?: string }
 */
export const createPracticePack = async (packData) => {
  try {
    if (!packData.name || !packData.subject || !packData.questionIds || packData.questionIds.length === 0) {
      return { success: false, error: 'Missing required pack data' };
    }

    // Get current user
    let { data: { user }, error: userError } = await supabase.auth.getUser();
    
    // If no user is authenticated, require login for pack creation
    if (userError || !user) {
      return { success: false, error: 'Please log in to create practice packs' };
    }

    // Create the question pack using two-table structure
    // 1. First insert creates the pack in question_packs table
    const { data: pack, error: packError } = await supabase
      .from('question_packs')
      .insert([
        {
          creator_id: user.id,
          name: packData.name,
          subject: packData.subject,  // ✅ Add subject field
          description: packData.description || '',
          is_public: false,
          tags: packData.settings?.tags || []
        }
      ])
      .select()
      .single();

    if (packError) {
      console.error('Supabase error creating question pack:', packError);
      return { success: false, error: packError.message };
    }

    // 2. After successful pack creation, insert into pack_questions table
    const packQuestions = packData.questionIds.map((questionId, index) => ({
      pack_id: pack.id,
      question_id: questionId,
      position: index
    }));

    const { error: questionsError } = await supabase
      .from('pack_questions')
      .insert(packQuestions);

    if (questionsError) {
      console.error('Supabase error adding questions to pack:', questionsError);
      // Clean up the pack if questions failed to insert
      await supabase.from('question_packs').delete().eq('id', pack.id);
      return { success: false, error: questionsError.message };
    }

    console.log('Question pack created successfully:', pack);
    return { success: true, data: pack };
  } catch (error) {
    console.error('Error creating question pack:', error);
    return { success: false, error: error.message || 'Failed to create question pack' };
  }
};

/**
 * Get all question packs for the current user, or public packs if not logged in
 * @returns {Object} { success: boolean, packs?: array, error?: string }
 */
export const getUserPracticePacks = async () => {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      // Return public/demo packs instead of authentication error
      console.log('User not authenticated - fetching public practice packs');
      
      const { data, error } = await supabase
        .from('question_packs')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching public packs:', error);
        // Return empty packs instead of error to allow practice page to load
        return { success: true, packs: [] };
      }

      return { success: true, packs: data || [] };
    }

    // User is authenticated - get their personal packs
    const { data, error } = await supabase
      .from('question_packs')
      .select('*')
      .eq('creator_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, packs: data };
  } catch (error) {
    console.error('Error in getUserPracticePacks:', error);
    // Return empty packs instead of error to allow practice page to load
    return { success: true, packs: [] };
  }
};

/**
 * Get a specific question pack by ID - allows access to public packs without authentication
 * @param {string} packId - The question pack ID
 * @returns {Object} { success: boolean, pack?: object, error?: string }
 */
export const getPracticePack = async (packId) => {
  try {
    if (!packId) {
      return { success: false, error: 'Pack ID is required' };
    }

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      // User not authenticated - only allow access to public packs
      const { data, error } = await supabase
        .from('question_packs')
        .select('*')
        .eq('id', packId)
        .eq('is_public', true)
        .single();

      if (error) {
        return { success: false, error: 'Pack not found or not accessible' };
      }

      return { success: true, pack: data };
    }

    // User is authenticated - allow access to their own packs OR public packs
    const { data, error } = await supabase
      .from('question_packs')
      .select('*')
      .eq('id', packId)
      .or(`creator_id.eq.${user.id},is_public.eq.true`)
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, pack: data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Delete a question pack - requires authentication
 * @param {string} packId - The question pack ID
 * @returns {Object} { success: boolean, error?: string }
 */
export const deletePracticePack = async (packId) => {
  try {
    if (!packId) {
      return { success: false, error: 'Pack ID is required' };
    }

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { success: false, error: 'Please log in to delete practice packs' };
    }

    const { error } = await supabase
      .from('question_packs')
      .delete()
      .eq('id', packId)
      .eq('creator_id', user.id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};