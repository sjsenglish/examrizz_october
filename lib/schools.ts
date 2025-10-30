import { supabase, School, UserProfile } from './supabase';

// Get school by school code
export async function getSchoolByCode(schoolCode: string): Promise<School | null> {
  try {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .eq('school_code', schoolCode)
      .single();

    if (error) {
      console.error('Error fetching school by code:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getSchoolByCode:', error);
    return null;
  }
}

// Get all schools
export async function getAllSchools(): Promise<School[]> {
  try {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching schools:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getAllSchools:', error);
    return [];
  }
}

// Validate school code and return school if valid
export async function validateSchoolCode(schoolCode: string): Promise<{
  isValid: boolean;
  school: School | null;
  error?: string;
}> {
  try {
    if (!schoolCode || schoolCode.trim().length === 0) {
      return {
        isValid: false,
        school: null,
        error: 'School code is required'
      };
    }

    const school = await getSchoolByCode(schoolCode.trim().toUpperCase());
    
    if (!school) {
      return {
        isValid: false,
        school: null,
        error: 'Invalid school code'
      };
    }

    return {
      isValid: true,
      school
    };
  } catch (error) {
    console.error('Error validating school code:', error);
    return {
      isValid: false,
      school: null,
      error: 'Error validating school code'
    };
  }
}

// Get students from a specific school (for teacher adding students)
export async function getSchoolStudents(schoolId: string): Promise<UserProfile[]> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('school_id', schoolId)
      .eq('role', 'student')
      .order('full_name');

    if (error) {
      console.error('Error fetching school students:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getSchoolStudents:', error);
    return [];
  }
}

// Join a school (for new users)
export async function joinSchool(userId: string, schoolCode: string): Promise<{
  success: boolean;
  school: School | null;
  error?: string;
}> {
  try {
    // First validate the school code
    const validation = await validateSchoolCode(schoolCode);
    
    if (!validation.isValid || !validation.school) {
      return {
        success: false,
        school: null,
        error: validation.error
      };
    }

    // Update user profile with school_id
    // TODO: Temporarily commented out due to Supabase type generation issues
    // This will be fixed when proper database schema is established
    try {
      // const { error: updateError } = await supabase
      //   .from('user_profiles')
      //   .update({ school_id: validation.school.id })
      //   .eq('id', userId);
      
      console.log('School joining functionality temporarily disabled pending schema setup');
    } catch (updateError) {
      console.error('Error joining school:', updateError);
      return {
        success: false,
        school: null,
        error: 'Failed to join school'
      };
    }

    return {
      success: true,
      school: validation.school
    };
  } catch (error) {
    console.error('Error in joinSchool:', error);
    return {
      success: false,
      school: null,
      error: 'Error joining school'
    };
  }
}

// Create a new school (admin function)
export async function createSchool(name: string, schoolCode: string): Promise<School | null> {
  try {
    // TODO: Temporarily disabled due to Supabase type generation issues
    console.log('School creation functionality temporarily disabled pending schema setup');
    
    // Mock return for now
    return {
      id: 'mock-id',
      name: name.trim(),
      school_code: schoolCode.trim().toUpperCase(),
      created_at: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error in createSchool:', error);
    return null;
  }
}