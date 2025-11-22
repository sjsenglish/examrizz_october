import { supabase, PackAssignment, PackAttempt, QuestionPack } from './supabase';

export interface AssignmentWithDetails extends PackAssignment {
  pack: QuestionPack;
  attempts: PackAttempt[];
  student_name?: string;
  class_name?: string;
}

export interface AssignmentAnalytics {
  totalAssigned: number;
  totalCompleted: number;
  averageScore: number;
  needingSupport: Array<{
    student_name: string;
    issue: string;
    details?: string;
  }>;
  topPerformers: Array<{
    student_name: string;
    score: string;
    time: string;
  }>;
}

// Create pack assignment
export async function createPackAssignment(
  packId: string,
  assignedBy: string,
  assignment: {
    assignedToUserIds?: string[];
    assignedToClassId?: string;
    dueDate?: string;
    timeLimitMinutes?: number;
    randomizeQuestions: boolean;
    instructions?: string;
    emailNotification: boolean;
    showInDashboard: boolean;
    scoreThresholdPercent?: number;
  }
): Promise<PackAssignment[]> {
  try {
    const assignments: Omit<PackAssignment, 'id' | 'assigned_at'>[] = [];

    // If assigning to individual users
    if (assignment.assignedToUserIds && assignment.assignedToUserIds.length > 0) {
      assignment.assignedToUserIds.forEach(userId => {
        assignments.push({
          pack_id: packId,
          assigned_by: assignedBy,
          assigned_to_user_id: userId,
          due_date: assignment.dueDate,
          time_limit_minutes: assignment.timeLimitMinutes,
          randomize_questions: assignment.randomizeQuestions,
          instructions: assignment.instructions,
          email_notification: assignment.emailNotification,
          show_in_dashboard: assignment.showInDashboard,
          score_threshold_percent: assignment.scoreThresholdPercent,
          status: 'active'
        });
      });
    }

    // If assigning to a class
    if (assignment.assignedToClassId) {
      assignments.push({
        pack_id: packId,
        assigned_by: assignedBy,
        assigned_to_class_id: assignment.assignedToClassId,
        due_date: assignment.dueDate,
        time_limit_minutes: assignment.timeLimitMinutes,
        randomize_questions: assignment.randomizeQuestions,
        instructions: assignment.instructions,
        email_notification: assignment.emailNotification,
        show_in_dashboard: assignment.showInDashboard,
        score_threshold_percent: assignment.scoreThresholdPercent,
        status: 'active'
      });
    }

    const assignmentsData: any = assignments;
    const { data, error } = await (supabase as any)
      .from('pack_assignments')
      .insert(assignmentsData)
      .select();

    if (error) {
      console.error('Error creating pack assignments:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in createPackAssignment:', error);
    return [];
  }
}

// Get teacher's question packs with assignment counts
export async function getTeacherPacksWithAssignments(teacherId: string): Promise<Array<QuestionPack & { assignmentCount: number }>> {
  try {
    // Check if database tables exist
    const { error: tableError } = await supabase.from('question_packs').select('count', { count: 'exact', head: true });
    if (tableError) {
      console.warn('Question packs table not available, returning empty array:', tableError.message);
      return [];
    }

    // Get all packs created by the teacher
    const { data: packs, error: packsError } = await (supabase as any)
      .from('question_packs')
      .select('*')
      .eq('creator_id', teacherId)
      .order('updated_at', { ascending: false });

    if (packsError) {
      console.error('Error fetching teacher packs:', packsError);
      return [];
    }

    if (!packs || packs.length === 0) {
      return [];
    }

    // Get assignment counts for each pack
    const packsWithCounts = await Promise.all(
      packs.map(async (pack: any) => {
        const { count, error: countError } = await (supabase as any)
          .from('pack_assignments')
          .select('*', { count: 'exact', head: true })
          .eq('pack_id', pack.id)
          .eq('status', 'active');

        if (countError) {
          console.error('Error counting assignments:', countError);
          return { ...pack, assignmentCount: 0 };
        }

        return { ...pack, assignmentCount: count || 0 };
      })
    );

    return packsWithCounts;
  } catch (error) {
    console.error('Error in getTeacherPacksWithAssignments:', error);
    return [];
  }
}

// Get assignment history for a specific pack
export async function getPackAssignmentHistory(packId: string, teacherId: string): Promise<AssignmentWithDetails[]> {
  try {
    const { data: assignments, error } = await (supabase as any)
      .from('pack_assignments')
      .select(`
        *,
        question_packs (
          id,
          name,
          subject,
          description
        )
      `)
      .eq('pack_id', packId)
      .eq('assigned_by', teacherId)
      .order('assigned_at', { ascending: false });

    if (error) {
      console.error('Error fetching pack assignment history:', error);
      return [];
    }

    if (!assignments) {
      return [];
    }

    // Get attempts and additional details for each assignment
    const assignmentsWithDetails = await Promise.all(
      assignments.map(async (assignment: any) => {
        // Get attempts for this assignment
        const { data: attempts, error: attemptsError } = await (supabase as any)
          .from('pack_attempts')
          .select('*')
          .eq('assignment_id', assignment.id);

        if (attemptsError) {
          console.error('Error fetching attempts:', attemptsError);
        }

        // Get student/class name if applicable
        let studentName = '';
        let className = '';

        if (assignment.assigned_to_user_id) {
          const { data: student } = await (supabase as any)
            .from('user_profiles')
            .select('full_name')
            .eq('id', assignment.assigned_to_user_id)
            .single();
          
          studentName = student?.full_name || '';
        }

        if (assignment.assigned_to_class_id) {
          const { data: classData } = await (supabase as any)
            .from('classes')
            .select('name')
            .eq('id', assignment.assigned_to_class_id)
            .single();
          
          className = classData?.name || '';
        }

        return {
          ...assignment,
          pack: assignment.question_packs,
          attempts: attempts || [],
          student_name: studentName,
          class_name: className
        };
      })
    );

    return assignmentsWithDetails;
  } catch (error) {
    console.error('Error in getPackAssignmentHistory:', error);
    return [];
  }
}

// Get ongoing assignments analytics for teacher dashboard
export async function getTeacherOngoingAssignments(teacherId: string): Promise<Array<{
  pack: QuestionPack;
  analytics: AssignmentAnalytics;
  dueDate?: string;
  isOverdue: boolean;
}>> {
  try {
    // Check if database tables exist
    const { error: tableError } = await (supabase as any).from('pack_assignments').select('count', { count: 'exact', head: true });
    if (tableError) {
      console.warn('Pack assignments table not available, returning empty array:', tableError.message);
      return [];
    }

    // Get all active assignments by this teacher
    const { data: assignments, error } = await (supabase as any)
      .from('pack_assignments')
      .select(`
        *,
        question_packs (
          id,
          name,
          subject,
          description
        )
      `)
      .eq('assigned_by', teacherId)
      .eq('status', 'active')
      .order('due_date', { ascending: true });

    if (error) {
      console.error('Error fetching ongoing assignments:', error);
      return [];
    }

    if (!assignments) {
      return [];
    }

    // Group by pack and calculate analytics
    const packMap = new Map<string, {
      pack: QuestionPack;
      assignments: typeof assignments;
      attempts: PackAttempt[];
    }>();

    // Collect all assignments by pack
    assignments.forEach((assignment: any) => {
      if (assignment.question_packs) {
        const packId = assignment.pack_id;
        if (!packMap.has(packId)) {
          packMap.set(packId, {
            pack: assignment.question_packs,
            assignments: [],
            attempts: []
          });
        }
        packMap.get(packId)!.assignments.push(assignment);
      }
    });

    // Get attempts for each pack
    for (const [packId, packData] of packMap.entries()) {
      const assignmentIds = packData.assignments.map((a: any) => a.id);
      
      if (assignmentIds.length > 0) {
        const { data: attempts } = await (supabase as any)
          .from('pack_attempts')
          .select('*')
          .in('assignment_id', assignmentIds);
        
        packData.attempts = attempts || [];
      }
    }

    // Calculate analytics for each pack
    const result = Array.from(packMap.values()).map(({ pack, assignments, attempts }) => {
      const totalAssigned = assignments.length;
      const totalCompleted = attempts.filter(a => a.completed_at).length;
      const completedAttempts = attempts.filter(a => a.score !== null);
      const averageScore = completedAttempts.length > 0
        ? completedAttempts.reduce((sum: number, a: any) => sum + (a.score || 0), 0) / completedAttempts.length
        : 0;

      // Find students needing support (low scores or no attempts)
      const needingSupport: AssignmentAnalytics['needingSupport'] = [];
      
      // Students with low scores
      completedAttempts.forEach(attempt => {
        if (attempt.score !== null && attempt.score !== undefined && attempt.score < 60) {
          needingSupport.push({
            student_name: 'Student', // Would need to join with user profiles for real name
            issue: `Score ${attempt.score}/${attempt.total_questions}`,
          });
        }
      });

      // Find top performers
      const topPerformers: AssignmentAnalytics['topPerformers'] = completedAttempts
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .slice(0, 3)
        .map(attempt => ({
          student_name: 'Student', // Would need to join with user profiles for real name
          score: `${attempt.score}/${attempt.total_questions}`,
          time: attempt.time_taken_seconds ? `${Math.round(attempt.time_taken_seconds / 60)} mins` : ''
        }));

      const analytics: AssignmentAnalytics = {
        totalAssigned,
        totalCompleted,
        averageScore,
        needingSupport,
        topPerformers
      };

      // Get earliest due date for this pack
      const dueDates = assignments
        .map((a: any) => a.due_date)
        .filter(Boolean)
        .sort();
      
      const dueDate = dueDates[0];
      const isOverdue = dueDate ? new Date(dueDate) < new Date() : false;

      return {
        pack,
        analytics,
        dueDate,
        isOverdue
      };
    });

    return result;
  } catch (error) {
    console.error('Error in getTeacherOngoingAssignments:', error);
    return [];
  }
}