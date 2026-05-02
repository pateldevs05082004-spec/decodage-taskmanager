/**
 * Migration: Add start_time to tasks table
 * 
 * Adds start_time field to track when a task should begin.
 * Makes deadline nullable so employees can create task requests without deadlines.
 */

export async function up(pgm) {
  // Add start_time column
  pgm.addColumn('tasks', {
    start_time: {
      type: 'timestamp',
    },
  });

  // Make deadline nullable (employees create tasks without deadlines)
  pgm.alterColumn('tasks', 'deadline', {
    notNull: false,
  });
}

export async function down(pgm) {
  pgm.dropColumn('tasks', 'start_time');
  
  pgm.alterColumn('tasks', 'deadline', {
    notNull: true,
  });
}
