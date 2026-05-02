/**
 * Migration: Seed admin user
 * 
 * Creates the initial admin user with email mandip.p@decodeage.com
 * Password: MANDIP@123 (should be changed after first login)
 */

export async function up(pgm) {
  // Pre-hashed password for 'MANDIP@123' using bcrypt with salt rounds 10
  const hashedPassword = '$2b$10$INLDgXP/ZkpcroAOMihZeuPo84vbrooLUAa6RvOoncIMDWXtZYGsK';
  
  // Delete old admin if exists
  pgm.sql(`
    DELETE FROM users WHERE email = 'pdev444444@gmail.com';
    DELETE FROM users WHERE email = 'mandeep.p@decodeage.com';
  `);
  
  // Insert new admin user
  pgm.sql(`
    INSERT INTO users (email, password, name, role)
    VALUES ('mandip.p@decodeage.com', '${hashedPassword}', 'Mandip', 'admin')
    ON CONFLICT (email) DO NOTHING;
  `);
}

export async function down(pgm) {
  pgm.sql(`
    DELETE FROM users WHERE email = 'mandip.p@decodeage.com';
  `);
}
