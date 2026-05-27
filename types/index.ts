export interface Scene {
  scene_number: number;
  title: string;
  duration_min: number;
  image_prompt: string;
  voice_script: string;
  capcut_note: string;
}

export interface Grade {
  id: string;
  name: string;
  level: number;
  created_at?: string;
}

export interface Program {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
}

export interface ProductionKit {
  id: string;
  module_id: string;
  scenes: Scene[];
  status: 'draft' | 'ready' | 'archived';
  created_at: string;
  grade_id?: string;
  modules?: { filename: string; metadata: any };
  answer_key?: Array<{
    question_number: number;
    correct_answer: string;
    max_score: number;
  }>;
}

export interface Student {
  id: string;
  full_name: string;
  current_level: number;
  parent_name: string;
  parent_phone: string;
  enrolled_at: string;
  status: 'active' | 'inactive';
  grade_id?: string;
  program_id?: string;
}

export interface Attendance {
  id: string;
  student_id: string;
  session_id: string;
  date: string;
  status: 'present' | 'absent' | 'late';
}

export interface Assessment {
  id: string;
  student_id: string;
  session_id: string;
  rubric_scores: Record<string, number>;
  total_score: number;
  tutor_notes: string;
}

export interface WorksheetSubmission {
  id: string;
  student_id: string;
  session_id: string;
  image_url: string;
  extracted_text?: string;
  ai_correction?: {
    answers: Array<{
      question_number: number;
      student_answer: string;
      correct_answer: string;
      is_correct: boolean;
      score: number;
      max_score: number;
      comment: string;
    }>;
    total_score: number;
    max_total: number;
    summary: string;
  };
  score?: number;
  confidence?: number;
  tutor_reviewed: boolean;
  created_at: string;
}
