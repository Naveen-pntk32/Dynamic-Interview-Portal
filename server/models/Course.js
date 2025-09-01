import pool from '../config/database.js';

export class Course {
  static async findAll() {
    const query = `
      SELECT id, title, description, duration, difficulty, category, 
             image_url, created_at, updated_at
      FROM courses 
      ORDER BY created_at DESC
    `;
    
    const result = await pool.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = `
      SELECT id, title, description, duration, difficulty, category, 
             image_url, syllabus, prerequisites, created_at, updated_at
      FROM courses 
      WHERE id = $1
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async create({ title, description, duration, difficulty, category, imageUrl, syllabus, prerequisites }) {
    const query = `
      INSERT INTO courses (title, description, duration, difficulty, category, 
                          image_url, syllabus, prerequisites, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      RETURNING *
    `;
    
    const values = [title, description, duration, difficulty, category, imageUrl, syllabus, prerequisites];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async update(id, { title, description, duration, difficulty, category, imageUrl, syllabus, prerequisites }) {
    const query = `
      UPDATE courses 
      SET title = $2, description = $3, duration = $4, difficulty = $5, 
          category = $6, image_url = $7, syllabus = $8, prerequisites = $9, 
          updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    
    const values = [id, title, description, duration, difficulty, category, imageUrl, syllabus, prerequisites];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM courses WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async findByCategory(category) {
    const query = `
      SELECT id, title, description, duration, difficulty, category, 
             image_url, created_at, updated_at
      FROM courses 
      WHERE category = $1
      ORDER BY created_at DESC
    `;
    
    const result = await pool.query(query, [category]);
    return result.rows;
  }
}
