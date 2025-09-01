import pool from '../config/database.js';
import bcrypt from 'bcryptjs';

export class User {
  static async create({ email, password, firstName, lastName, phone }) {
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const query = `
      INSERT INTO users (email, password, first_name, last_name, phone, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING id, email, first_name, last_name, phone, created_at
    `;
    
    const values = [email, hashedPassword, firstName, lastName, phone];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = `
      SELECT id, email, first_name, last_name, phone, resume_url, created_at, updated_at 
      FROM users WHERE id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async updateProfile(id, { firstName, lastName, phone }) {
    const query = `
      UPDATE users 
      SET first_name = $2, last_name = $3, phone = $4, updated_at = NOW()
      WHERE id = $1
      RETURNING id, email, first_name, last_name, phone, resume_url, updated_at
    `;
    
    const values = [id, firstName, lastName, phone];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async updateResumeUrl(id, resumeUrl) {
    const query = `
      UPDATE users 
      SET resume_url = $2, updated_at = NOW()
      WHERE id = $1
      RETURNING id, email, first_name, last_name, phone, resume_url, updated_at
    `;
    
    const result = await pool.query(query, [id, resumeUrl]);
    return result.rows[0];
  }

  static async updatePassword(id, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    const query = `
      UPDATE users 
      SET password = $2, updated_at = NOW()
      WHERE id = $1
    `;
    
    await pool.query(query, [id, hashedPassword]);
  }

  static async validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async createPasswordResetToken(email, token, expiresAt) {
    const query = `
      INSERT INTO password_reset_tokens (email, token, expires_at, created_at)
      VALUES ($1, $2, $3, NOW())
      ON CONFLICT (email) 
      DO UPDATE SET token = $2, expires_at = $3, created_at = NOW()
    `;
    
    await pool.query(query, [email, token, expiresAt]);
  }

  static async findPasswordResetToken(token) {
    const query = `
      SELECT * FROM password_reset_tokens 
      WHERE token = $1 AND expires_at > NOW()
    `;
    
    const result = await pool.query(query, [token]);
    return result.rows[0];
  }

  static async deletePasswordResetToken(token) {
    const query = 'DELETE FROM password_reset_tokens WHERE token = $1';
    await pool.query(query, [token]);
  }
}
