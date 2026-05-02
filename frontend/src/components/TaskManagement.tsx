import { useState, useEffect } from 'react';

interface Task {
  id: string;
  description: string;
  start_time: string | null;
  deadline: string | null;
  assigned_to: string | null;
  assigned_to_name?: string;
  assigned_to_email?: string;
  created_by: string;
  created_by_name?: string;
  status: 'incomplete' | 'complete';
  completed_at: string | null;
  created_at: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface TaskManagementProps {
  token: string;
  currentUser: User;
}

export default function TaskManagement({ token, currentUser }: TaskManagementProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [activeTab, setActiveTab] = useState<'mywork' | 'delegated' | 'all'>('mywork');
  const [newTask, setNewTask] = useState({
    description: '',
    start_time: '',
    deadline: '',
    assigned_to: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    incomplete: 0,
    overdue: 0,
  });

  useEffect(() => {
    fetchTasks();
    fetchStats();
    // Fetch all users (both employees and admins) for assignment
    fetchUsers();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/tasks', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(data.tasks);
      }
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Store all users for assignment dropdown
        setUsers(data.users);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/tasks/stats', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTask),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create task');
        return;
      }

      setSuccess('Task created successfully!');
      setNewTask({ description: '', start_time: '', deadline: '', assigned_to: '' });
      setShowAddTask(false);
      fetchTasks();
      fetchStats();
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  const handleEditTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;

    setError('');
    setSuccess('');

    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${editingTask.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          description: editingTask.description,
          start_time: editingTask.start_time,
          deadline: editingTask.deadline,
          assigned_to: editingTask.assigned_to,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to update task');
        return;
      }

      setSuccess('Task updated successfully!');
      setEditingTask(null);
      fetchTasks();
      fetchStats();
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  const handleToggleStatus = async (taskId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'complete' ? 'incomplete' : 'complete';

      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setSuccess('Task status updated!');
        fetchTasks();
        fetchStats();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to update task');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setSuccess('Task deleted successfully!');
        fetchTasks();
        fetchStats();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete task');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isOverdue = (deadline: string | null, status: string) => {
    if (!deadline) return false;
    return status === 'incomplete' && new Date(deadline) < new Date();
  };

  const filteredTasks = tasks.filter((task) => {
    // Tab-based filtering
    if (activeTab === 'mywork') {
      // Show tasks assigned to me
      return task.assigned_to === currentUser.id;
    } else if (activeTab === 'delegated') {
      // Show tasks I created for others
      return task.created_by === currentUser.id && task.assigned_to !== currentUser.id;
    }
    // 'all' tab shows everything
    return true;
  });

  // Helper function to check if a date is today
  const isToday = (deadline: string | null) => {
    if (!deadline) return false;
    const today = new Date();
    const taskDate = new Date(deadline);
    return taskDate.toDateString() === today.toDateString();
  };

  // Group tasks by priority
  const overdueTasks = filteredTasks.filter(t => isOverdue(t.deadline, t.status));
  const todayTasks = filteredTasks.filter(t => !isOverdue(t.deadline, t.status) && isToday(t.deadline) && t.status === 'incomplete');
  const upcomingTasks = filteredTasks.filter(t => !isOverdue(t.deadline, t.status) && !isToday(t.deadline) && t.status === 'incomplete');
  const completedTasks = filteredTasks.filter(t => t.status === 'complete');

  const renderTask = (task: Task) => {
    const isAssignedToMe = task.assigned_to === currentUser.id;
    const isCreatedByMe = task.created_by === currentUser.id;
    
    return (
      <div
        key={task.id}
        style={{
          ...styles.taskCard,
          ...(task.status === 'complete' ? styles.taskCardComplete : {}),
          ...(isOverdue(task.deadline, task.status) ? styles.taskCardOverdue : {}),
        }}
      >
        <div style={styles.taskHeader}>
          <div style={styles.taskStatus}>
            <input
              type="checkbox"
              checked={task.status === 'complete'}
              onChange={() => handleToggleStatus(task.id, task.status)}
              style={styles.checkbox}
            />
            <div style={{ flex: 1 }}>
              <span
                style={{
                  ...styles.taskDescription,
                  ...(task.status === 'complete' ? styles.taskDescriptionComplete : {}),
                }}
              >
                {task.description}
              </span>
            </div>
          </div>
          <div style={styles.taskActions}>
            {isCreatedByMe && (
              <>
                <button
                  onClick={() => setEditingTask(task)}
                  style={styles.editButton}
                >
                  Edit
                </button>
                <button onClick={() => handleDeleteTask(task.id)} style={styles.deleteButton}>
                  Delete
                </button>
              </>
            )}
          </div>
        </div>

        <div style={styles.taskDetails}>
          {task.assigned_to_name && (
            <div style={styles.taskDetail}>
              <strong>👤 Assigned to:</strong> {task.assigned_to_name}
            </div>
          )}
          {task.deadline && (
            <div style={styles.taskDetail}>
              <strong>📅 Due:</strong> {formatDate(task.deadline)}
              {isOverdue(task.deadline, task.status) && (
                <span style={styles.overdueLabel}> (OVERDUE)</span>
              )}
            </div>
          )}
          {task.created_by_name && activeTab === 'all' && (
            <div style={styles.taskDetail}>
              <strong>✏️ Created by:</strong> {task.created_by_name}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      {error && <div style={styles.error}>{error}</div>}
      {success && <div style={styles.success}>{success}</div>}

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{stats.total}</div>
          <div style={styles.statLabel}>Total Tasks</div>
        </div>
        <div style={{ ...styles.statCard, ...styles.statCardIncomplete }}>
          <div style={styles.statNumber}>{stats.incomplete}</div>
          <div style={styles.statLabel}>Incomplete</div>
        </div>
        <div style={{ ...styles.statCard, ...styles.statCardComplete }}>
          <div style={styles.statNumber}>{stats.completed}</div>
          <div style={styles.statLabel}>Completed</div>
        </div>
        <div style={{ ...styles.statCard, ...styles.statCardOverdue }}>
          <div style={styles.statNumber}>{stats.overdue}</div>
          <div style={styles.statLabel}>Overdue</div>
        </div>
      </div>

      {/* Header with Tabs */}
      <div style={styles.header}>
        <div style={styles.tabsContainer}>
          <button
            onClick={() => setActiveTab('mywork')}
            style={activeTab === 'mywork' ? styles.tabActive : styles.tab}
          >
            📋 My Work
            {tasks.filter(t => t.assigned_to === currentUser.id && t.status === 'incomplete').length > 0 && (
              <span style={styles.tabBadge}>
                {tasks.filter(t => t.assigned_to === currentUser.id && t.status === 'incomplete').length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('delegated')}
            style={activeTab === 'delegated' ? styles.tabActive : styles.tab}
          >
            👥 Delegated
            {tasks.filter(t => t.created_by === currentUser.id && t.assigned_to !== currentUser.id && t.status === 'incomplete').length > 0 && (
              <span style={styles.tabBadge}>
                {tasks.filter(t => t.created_by === currentUser.id && t.assigned_to !== currentUser.id && t.status === 'incomplete').length}
              </span>
            )}
          </button>
          {currentUser.role === 'admin' && (
            <button
              onClick={() => setActiveTab('all')}
              style={activeTab === 'all' ? styles.tabActive : styles.tab}
            >
              🌐 All Tasks
              {tasks.filter(t => t.status === 'incomplete').length > 0 && (
                <span style={styles.tabBadge}>
                  {tasks.filter(t => t.status === 'incomplete').length}
                </span>
              )}
            </button>
          )}
        </div>
        <button onClick={() => setShowAddTask(!showAddTask)} style={styles.addButton}>
          {showAddTask ? '✕ Cancel' : '+ New Task'}
        </button>
      </div>

      {/* Edit Task Modal */}
      {editingTask && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3 style={styles.formTitle}>Edit Task</h3>
            <form onSubmit={handleEditTask}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Description</label>
                <textarea
                  value={editingTask.description}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, description: e.target.value })
                  }
                  required
                  style={styles.textarea}
                  rows={3}
                />
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Start Time</label>
                  <input
                    type="datetime-local"
                    value={editingTask.start_time || ''}
                    onChange={(e) =>
                      setEditingTask({ ...editingTask, start_time: e.target.value })
                    }
                    required
                    style={styles.input}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>End Time (Deadline)</label>
                  <input
                    type="datetime-local"
                    value={editingTask.deadline || ''}
                    onChange={(e) =>
                      setEditingTask({ ...editingTask, deadline: e.target.value })
                    }
                    required
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Assign To</label>
                <select
                  value={editingTask.assigned_to || ''}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, assigned_to: e.target.value })
                  }
                  style={styles.input}
                >
                  <option value="">Unassigned</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email}) - {user.role}
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.modalActions}>
                <button type="submit" style={styles.submitButton}>
                  Update Task
                </button>
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  style={styles.cancelButton}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Task Form */}
      {showAddTask && (
        <div style={styles.addTaskForm}>
          <h3 style={styles.formTitle}>Add Task</h3>
          <form onSubmit={handleAddTask}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Description</label>
              <textarea
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                required
                style={styles.textarea}
                rows={3}
                placeholder="Enter task description..."
              />
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Start Time</label>
                <input
                  type="datetime-local"
                  value={newTask.start_time}
                  onChange={(e) => setNewTask({ ...newTask, start_time: e.target.value })}
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>End Time (Deadline)</label>
                <input
                  type="datetime-local"
                  value={newTask.deadline}
                  onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                  required
                  style={styles.input}
                />
              </div>
            </div>

            {currentUser.role === 'admin' && (
              <div style={styles.formGroup}>
                <label style={styles.label}>Assign To</label>
                <select
                  value={newTask.assigned_to}
                  onChange={(e) => setNewTask({ ...newTask, assigned_to: e.target.value })}
                  style={styles.input}
                >
                  <option value="">Unassigned</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {currentUser.role === 'employee' && (
              <div style={styles.formGroup}>
                <label style={styles.label}>Assign To (Optional)</label>
                <select
                  value={newTask.assigned_to}
                  onChange={(e) => setNewTask({ ...newTask, assigned_to: e.target.value })}
                  style={styles.input}
                >
                  <option value="">Myself</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email}) - {user.role}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button type="submit" style={styles.submitButton}>
              Add Task
            </button>
          </form>
        </div>
      )}

      {/* Tasks List with Sections */}
      <div style={styles.taskList}>
        {filteredTasks.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyIcon}>📭</p>
            <p style={styles.emptyText}>No tasks here</p>
            <p style={styles.emptyHint}>Create a new task to get started</p>
          </div>
        ) : (
          <>
            {/* Overdue Section */}
            {overdueTasks.length > 0 && (
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>
                  🔴 Overdue ({overdueTasks.length})
                </h3>
                {overdueTasks.map((task) => renderTask(task))}
              </div>
            )}

            {/* Today Section */}
            {todayTasks.length > 0 && (
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>
                  🟠 Due Today ({todayTasks.length})
                </h3>
                {todayTasks.map((task) => renderTask(task))}
              </div>
            )}

            {/* Upcoming Section */}
            {upcomingTasks.length > 0 && (
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>
                  🔵 Upcoming ({upcomingTasks.length})
                </h3>
                {upcomingTasks.map((task) => renderTask(task))}
              </div>
            )}

            {/* Completed Section */}
            {completedTasks.length > 0 && (
              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>
                  ✅ Completed ({completedTasks.length})
                </h3>
                {completedTasks.map((task) => renderTask(task))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
    marginBottom: '30px',
  },
  statCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    textAlign: 'center' as const,
  },
  statCardIncomplete: {
    borderLeft: '4px solid #ffc107',
  },
  statCardComplete: {
    borderLeft: '4px solid #28a745',
  },
  statCardOverdue: {
    borderLeft: '4px solid #dc3545',
  },
  statNumber: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '5px',
  },
  statLabel: {
    fontSize: '14px',
    color: '#666',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    gap: '20px',
  },
  tabsContainer: {
    display: 'flex',
    gap: '8px',
    flex: 1,
  },
  tab: {
    padding: '12px 20px',
    backgroundColor: 'white',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '500' as const,
    color: '#666',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  tabActive: {
    padding: '12px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: '2px solid #007bff',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600' as const,
    boxShadow: '0 2px 8px rgba(0,123,255,0.3)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  tabBadge: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold' as const,
  },
  addButton: {
    padding: '12px 24px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600' as const,
    boxShadow: '0 2px 8px rgba(40,167,69,0.3)',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap' as const,
  },
  section: {
    marginBottom: '30px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '600' as const,
    color: '#333',
    marginBottom: '15px',
    padding: '10px 15px',
    backgroundColor: '#f8f9fa',
    borderRadius: '6px',
    borderLeft: '4px solid #007bff',
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '60px 20px',
    color: '#999',
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '16px',
  },
  emptyText: {
    fontSize: '20px',
    fontWeight: '600' as const,
    color: '#666',
    marginBottom: '8px',
  },
  emptyHint: {
    fontSize: '14px',
    color: '#999',
  },
  addTaskForm: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  formTitle: {
    fontSize: '18px',
    marginBottom: '15px',
    color: '#333',
  },
  formNote: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '15px',
    fontStyle: 'italic' as const,
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: '500' as const,
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    boxSizing: 'border-box' as const,
  },
  textarea: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    boxSizing: 'border-box' as const,
    fontFamily: 'inherit',
  },
  submitButton: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  taskList: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  taskCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    borderLeft: '4px solid #007bff',
  },
  taskCardComplete: {
    borderLeft: '4px solid #28a745',
    backgroundColor: '#f8f9fa',
  },
  taskCardOverdue: {
    borderLeft: '4px solid #dc3545',
  },
  taskHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '15px',
  },
  taskStatus: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    flex: 1,
  },
  checkbox: {
    marginTop: '4px',
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  },
  taskDescription: {
    fontSize: '16px',
    color: '#333',
    flex: 1,
  },
  taskDescriptionComplete: {
    textDecoration: 'line-through',
    color: '#999',
  },
  deleteButton: {
    padding: '6px 12px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  editButton: {
    padding: '6px 12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  taskActions: {
    display: 'flex',
    gap: '8px',
  },
  taskDetails: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  taskDetail: {
    fontSize: '14px',
    color: '#666',
  },
  overdueLabel: {
    color: '#dc3545',
    fontWeight: 'bold' as const,
  },
  pendingLabel: {
    color: '#ffc107',
    fontStyle: 'italic' as const,
  },
  error: {
    padding: '12px',
    backgroundColor: '#fee',
    color: '#c33',
    borderRadius: '4px',
    marginBottom: '20px',
  },
  success: {
    padding: '12px',
    backgroundColor: '#d4edda',
    color: '#155724',
    borderRadius: '4px',
    marginBottom: '20px',
  },
  modal: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    maxWidth: '600px',
    width: '90%',
    maxHeight: '90vh',
    overflow: 'auto',
  },
  modalActions: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};
