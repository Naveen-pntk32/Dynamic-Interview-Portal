import pool from '../config/database.js';

export class InterviewQuestion {
  static async findByType(type, limit = 10) {
    const query = `
      SELECT id, question, options, correct_answer, difficulty, category, type
      FROM interview_questions 
      WHERE type = $1
      ORDER BY RANDOM()
      LIMIT $2
    `;
    
    const result = await pool.query(query, [type, limit]);
    return result.rows;
  }

  static async findById(id) {
    const query = `
      SELECT id, question, options, correct_answer, difficulty, category, type
      FROM interview_questions 
      WHERE id = $1
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async create({ question, options, correctAnswer, difficulty, category, type }) {
    const query = `
      INSERT INTO interview_questions (question, options, correct_answer, difficulty, category, type, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING *
    `;
    
    const values = [question, JSON.stringify(options), correctAnswer, difficulty, category, type];
    const result = await pool.query(query, values);
    return result.rows[0];
  }
}

export class InterviewAttempt {
  static async create({ userId, type, questions, totalQuestions }) {
    const query = `
      INSERT INTO interview_attempts (user_id, type, questions, total_questions, status, created_at)
      VALUES ($1, $2, $3, $4, 'in_progress', NOW())
      RETURNING *
    `;
    
    const values = [userId, type, JSON.stringify(questions), totalQuestions];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findById(id) {
    const query = `
      SELECT ia.*, u.first_name, u.last_name, u.email
      FROM interview_attempts ia
      JOIN users u ON ia.user_id = u.id
      WHERE ia.id = $1
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByUserId(userId, limit = 10, offset = 0) {
    const query = `
      SELECT id, type, total_questions, score, status, created_at, completed_at
      FROM interview_attempts 
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `;
    
    const result = await pool.query(query, [userId, limit, offset]);
    return result.rows;
  }

  static async submit(id, { answers, score, timeTaken }) {
    const query = `
      UPDATE interview_attempts 
      SET answers = $2, score = $3, time_taken = $4, status = 'completed', completed_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    
    const values = [id, JSON.stringify(answers), score, timeTaken];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async updateStatus(id, status) {
    const query = `
      UPDATE interview_attempts 
      SET status = $2, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await pool.query(query, [id, status]);
    return result.rows[0];
  }

  static async getStats(userId) {
    const query = `
      SELECT 
        COUNT(*) as total_attempts,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_attempts,
        AVG(CASE WHEN status = 'completed' THEN score END) as average_score,
        MAX(score) as best_score
      FROM interview_attempts 
      WHERE user_id = $1
    `;
    
    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }
}

export class Feedback {
  static async create({ attemptId, userId, feedback, rating }) {
    const query = `
      INSERT INTO feedback (attempt_id, user_id, feedback, rating, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING *
    `;
    
    const values = [attemptId, userId, feedback, rating];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByAttemptId(attemptId) {
    const query = `
      SELECT f.*, u.first_name, u.last_name
      FROM feedback f
      JOIN users u ON f.user_id = u.id
      WHERE f.attempt_id = $1
    `;
    
    const result = await pool.query(query, [attemptId]);
    return result.rows[0];
  }
}
