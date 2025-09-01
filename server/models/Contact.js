import pool from '../config/database.js';

export class Contact {
  static async create({ name, email, subject, message }) {
    const query = `
      INSERT INTO contact_messages (name, email, subject, message, status, created_at)
      VALUES ($1, $2, $3, $4, 'unread', NOW())
      RETURNING *
    `;
    
    const values = [name, email, subject, message];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findAll(limit = 50, offset = 0) {
    const query = `
      SELECT id, name, email, subject, message, status, created_at
      FROM contact_messages 
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `;
    
    const result = await pool.query(query, [limit, offset]);
    return result.rows;
  }

  static async findById(id) {
    const query = `
      SELECT id, name, email, subject, message, status, created_at, updated_at
      FROM contact_messages 
      WHERE id = $1
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async updateStatus(id, status) {
    const query = `
      UPDATE contact_messages 
      SET status = $2, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await pool.query(query, [id, status]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM contact_messages WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async getStats() {
    const query = `
      SELECT 
        COUNT(*) as total_messages,
        COUNT(CASE WHEN status = 'unread' THEN 1 END) as unread_messages,
        COUNT(CASE WHEN status = 'read' THEN 1 END) as read_messages,
        COUNT(CASE WHEN status = 'replied' THEN 1 END) as replied_messages
      FROM contact_messages
    `;
    
    const result = await pool.query(query);
    return result.rows[0];
  }
}
