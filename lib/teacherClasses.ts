import { supabase, Class, ClassMembership, UserProfile } from './supabase';

export interface ClassWithStudents extends Class {
  students: UserProfile[];
  studentCount: number;
}

export interface Student extends UserProfile {
  class_name?: string;
}

// Get all classes for a teacher
export async function getTeacherClasses(teacherId: string): Promise<ClassWithStudents[]> {
  try {
    // Check if database tables exist
    const { error: tableError } = await supabase.from('classes').select('count', { count: 'exact', head: true });
    if (tableError) {
      console.warn('Classes table not available, returning empty array:', tableError.message);
      return [];
    }

    // First get the classes
    const { data: classes, error: classError } = await supabase
      .from('classes')
      .select('*')
      .eq('teacher_id', teacherId)
      .order('created_at', { ascending: false });

    if (classError) {
      console.error('Error fetching teacher classes:', classError);
      return [];
    }

    if (!classes || classes.length === 0) {
      return [];
    }

    // Get student counts for each class
    const classesWithStudents = await Promise.all(
      classes.map(async (classItem) => {
        const { data: memberships, error: membershipError } = await supabase
          .from('class_memberships')
          .select(`
            student_id,
            user_profiles (
              id,
              full_name,
              email,
              role,
              school_id,
              created_at
            )
          `)
          .eq('class_id', classItem.id);

        if (membershipError) {
          console.error('Error fetching class memberships:', membershipError);
          return {
            ...classItem,
            students: [],
            studentCount: 0
          };
        }

        const students = memberships?.map(m => m.user_profiles).filter(Boolean) as UserProfile[] || [];
        
        return {
          ...classItem,
          students,
          studentCount: students.length
        };
      })
    );

    return classesWithStudents;
  } catch (error) {
    console.error('Error in getTeacherClasses:', error);
    return [];
  }
}

// Get students in a specific class
export async function getClassStudents(classId: string): Promise<Student[]> {
  try {
    const { data: memberships, error } = await supabase
      .from('class_memberships')
      .select(`
        student_id,
        user_profiles (
          id,
          full_name,
          email,
          role,
          school_id,
          created_at
        )
      `)
      .eq('class_id', classId);

    if (error) {
      console.error('Error fetching class students:', error);
      return [];
    }

    return memberships?.map(m => m.user_profiles).filter(Boolean) as Student[] || [];
  } catch (error) {
    console.error('Error in getClassStudents:', error);
    return [];
  }
}

// Get all students for a teacher (across all their classes)
export async function getAllTeacherStudents(teacherId: string): Promise<Student[]> {
  try {
    // Check if database tables exist
    const { error: tableError } = await supabase.from('classes').select('count', { count: 'exact', head: true });
    if (tableError) {
      console.warn('Classes table not available, returning empty array:', tableError.message);
      return [];
    }

    // First get all teacher's classes
    const { data: classes, error: classError } = await supabase
      .from('classes')
      .select('id, name')
      .eq('teacher_id', teacherId);

    if (classError || !classes) {
      console.error('Error fetching teacher classes:', classError);
      return [];
    }

    const classIds = classes.map(c => c.id);
    
    if (classIds.length === 0) {
      return [];
    }

    // Get all students from these classes
    const { data: memberships, error: membershipError } = await supabase
      .from('class_memberships')
      .select(`
        class_id,
        student_id,
        user_profiles (
          id,
          full_name,
          email,
          role,
          school_id,
          created_at
        )
      `)
      .in('class_id', classIds);

    if (membershipError) {
      console.error('Error fetching student memberships:', membershipError);
      return [];
    }

    // Map students with their class names and remove duplicates
    const studentsMap = new Map<string, Student>();
    
    memberships?.forEach(membership => {
      if (membership.user_profiles) {
        const classInfo = classes.find(c => c.id === membership.class_id);
        const student: Student = {
          ...(membership.user_profiles as UserProfile),
          class_name: classInfo?.name
        };
        studentsMap.set(student.id, student);
      }
    });

    return Array.from(studentsMap.values());
  } catch (error) {
    console.error('Error in getAllTeacherStudents:', error);
    return [];
  }
}

// Create a new class
export async function createClass(teacherId: string, schoolId: string, name: string, description?: string): Promise<Class | null> {
  try {
    const { data, error } = await supabase
      .from('classes')
      .insert({
        teacher_id: teacherId,
        school_id: schoolId,
        name,
        description
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating class:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in createClass:', error);
    return null;
  }
}

// Add student to class
export async function addStudentToClass(classId: string, studentId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('class_memberships')
      .insert({
        class_id: classId,
        student_id: studentId
      });

    if (error) {
      console.error('Error adding student to class:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in addStudentToClass:', error);
    return false;
  }
}

// Remove student from class
export async function removeStudentFromClass(classId: string, studentId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('class_memberships')
      .delete()
      .eq('class_id', classId)
      .eq('student_id', studentId);

    if (error) {
      console.error('Error removing student from class:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in removeStudentFromClass:', error);
    return false;
  }
}