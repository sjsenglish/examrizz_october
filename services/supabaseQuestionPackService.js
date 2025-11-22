import { supabase } from '../lib/supabase';

/**
 * Create a new question pack
 * @param {string} userId - The creator's user ID
 * @param {Object} packData - Question pack data
 * @returns {Object} { success: boolean, packId?: string, error?: string }
 */
export const createQuestionPack = async (userId, packData) => {
  try {
    if (!userId) {
      return { success: false, error: 'User ID is required' };
    }

    const {
      packName,
      subject,
      question_ids,
      totalQuestions,
      is_public = false,
      tags = [],
      styling
    } = packData;

    // Validate required fields
    if (!packName || !subject || !question_ids || !totalQuestions || !styling) {
      return { success: false, error: 'Missing required fields: packName, subject, question_ids, totalQuestions, styling' };
    }

    // Validate subject
    if (!['tsa', 'bmat', 'maths'].includes(subject)) {
      return { success: false, error: 'Subject must be one of: tsa, bmat, maths' };
    }

    // Validate styling object
    const { fontSize, includeAnswers, separateAnswerSheet, showDate } = styling;
    if (
      typeof fontSize !== 'number' || 
      fontSize < 10 || 
      fontSize > 16 ||
      typeof includeAnswers !== 'boolean' ||
      typeof separateAnswerSheet !== 'boolean' ||
      typeof showDate !== 'boolean'
    ) {
      return { success: false, error: 'Invalid styling configuration' };
    }

    // Validate question_ids array
    if (!Array.isArray(question_ids) || question_ids.length === 0) {
      return { success: false, error: 'question_ids must be a non-empty array' };
    }

    const questionPackData = {
      creator_id: userId,
      pack_name: packName,
      subject,
      question_ids,
      total_questions: totalQuestions,
      is_public,
      tags,
      styling,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await (supabase as any)
      .from('question_packs')
      .insert(questionPackData)
      .select('id')
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, packId: data.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Get all question packs for a user
 * @param {string} userId - The user's ID
 * @returns {Object} { success: boolean, data?: array, error?: string }
 */
export const getUserQuestionPacks = async (userId) => {
  try {
    if (!userId) {
      return { success: false, error: 'User ID is required' };
    }

    const { data, error } = await (supabase as any)
      .from('question_packs')
      .select('*')
      .eq('creator_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Get a single question pack by ID
 * @param {string} packId - The pack ID
 * @returns {Object} { success: boolean, data?: object, error?: string }
 */
export const getQuestionPack = async (packId) => {
  try {
    if (!packId) {
      return { success: false, error: 'Pack ID is required' };
    }

    const { data, error } = await (supabase as any)
      .from('question_packs')
      .select('*')
      .eq('id', packId)
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Update a question pack
 * @param {string} packId - The pack ID
 * @param {Object} updates - Fields to update
 * @returns {Object} { success: boolean, data?: object, error?: string }
 */
export const updateQuestionPack = async (packId, updates) => {
  try {
    if (!packId) {
      return { success: false, error: 'Pack ID is required' };
    }

    if (!updates || Object.keys(updates).length === 0) {
      return { success: false, error: 'Updates object is required' };
    }

    // Add updated_at timestamp
    const updateData = {
      ...updates,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await (supabase as any)
      .from('question_packs')
      .update(updateData)
      .eq('id', packId)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Delete a question pack
 * @param {string} packId - The pack ID
 * @returns {Object} { success: boolean, error?: string }
 */
export const deleteQuestionPack = async (packId) => {
  try {
    if (!packId) {
      return { success: false, error: 'Pack ID is required' };
    }

    const { error } = await (supabase as any)
      .from('question_packs')
      .delete()
      .eq('id', packId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};