import { useState, useEffect } from 'react';
import { FiMenu, FiEdit, FiTrash2 } from 'react-icons/fi'; // Ensure react-icons is installed

function TodoList() {
  // Current date and time for overdue checks (10:35 AM EAT, May 23, 2025)
  const currentDate = new Date('2025-05-23T10:35:00+03:00');

  // Initialize todos from localStorage with dueDate
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos
      ? JSON.parse(savedTodos).map((todo) => ({
          ...todo,
          dueDate: todo.dueDate || null,
          timestamp: todo.timestamp || new Date().toLocaleString('en-US', { timeZone: 'Africa/Nairobi' }),
        }))
      : [];
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // For adding tasks
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // For editing tasks
  const [input, setInput] = useState(''); // For adding new tasks
  const [editInput, setEditInput] = useState(''); // For editing task text
  const [editDueDate, setEditDueDate] = useState(''); // For editing due date
  const [editTimestamp, setEditTimestamp] = useState(''); // For editing timestamp
  const [editTaskId, setEditTaskId] = useState(null); // Track which task is being edited

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Africa/Nairobi' });
    const dueDate = editDueDate || null; // Use entered due date or null if none
    setTodos([...todos, { id: Date.now(), text: input, completed: false, timestamp, dueDate }]);
    setInput('');
    setEditDueDate('');
    setIsAddModalOpen(false);
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const startEditing = (id, text, timestamp, dueDate) => {
    setEditTaskId(id);
    setEditInput(text);
    setEditTimestamp(timestamp);
    setEditDueDate(dueDate || '');
    setIsEditModalOpen(true);
  };

  const editTodo = (e) => {
    e.preventDefault();
    if (!editInput.trim()) return;
    const dueDate = editDueDate || null; // Use entered due date or null if none
    setTodos(
      todos.map((todo) =>
        todo.id === editTaskId
          ? { ...todo, text: editInput, timestamp: editTimestamp || todo.timestamp, dueDate }
          : todo
      )
    );
    setEditInput('');
    setEditDueDate('');
    setEditTimestamp('');
    setEditTaskId(null);
    setIsEditModalOpen(false);
  };

  // Format due date for display
  const formatDueDate = (dueDate) => {
    if (!dueDate) return 'No due date';
    const date = new Date(dueDate);
    return `Due: ${date.toLocaleString('en-US', {
      timeZone: 'Africa/Nairobi',
      dateStyle: 'medium',
      timeStyle: 'short',
    })} EAT`;
  };

  // Check if due date is overdue
  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < currentDate;
  };

  return (
    <div className="bg-gradient-to-b from-orange-200 to-orange-400">
      {/* Header */}
      <div className="flex flex-col items-center bg-blue-600 p-3">
        <div className="flex items-center justify-between w-full">
          <FiMenu className="text-white h-6 w-6" />
          <h1 className="text-white text-lg font-semibold">Todo List</h1>
          <div className="w-6" /> {/* Spacer for alignment */}
        </div>
        <p className="text-white text-sm mt-1 opacity-80">
          Current Time: Friday, May 23, 2025, 10:35 AM EAT
        </p>
      </div>

      {/* Todo List */}
      <div className="p-6">
        {todos.length === 0 ? (
          <p className="text-gray-600 text-center">No tasks yet. Add one!</p>
        ) : (
          <ul className="space-y-5">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center justify-between p-5 bg-white/70 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 animate-fadeIn"
              >
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="h-6 w-6 text-blue-600 rounded focus:ring-orange-400"
                  />
                  <div>
                    <span
                      className={`${
                        todo.completed ? 'line-through text-gray-400' : 'text-gray-900'
                      } text-xl`}
                    >
                      {todo.text}
                    </span>
                    <p className="text-sm text-gray-600">{todo.timestamp}</p>
                    <p
                      className={`text-sm ${
                        isOverdue(todo.dueDate) ? 'text-red-600 font-semibold' : 'text-gray-600'
                      }`}
                    >
                      {formatDueDate(todo.dueDate)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <FiEdit
                    onClick={() => startEditing(todo.id, todo.text, todo.timestamp, todo.dueDate)}
                    className="h-6 w-6 text-gray-600 cursor-pointer hover:text-blue-600 transition duration-200"
                  />
                  <FiTrash2
                    onClick={() => deleteTodo(todo.id)}
                    className="h-6 w-6 text-gray-600 cursor-pointer hover:text-red-600 transition duration-200"
                  />
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* New Task Button */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="mt-6 w-full bg-blue-600 text-white py-3 rounded-full flex items-center justify-center gap-2 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 transition duration-200"
        >
          <span className="text-xl">+</span> New task
        </button>
      </div>

      {/* Modal for Adding New Task */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 w-full max-w-xs">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">Add New Task</h2>
            <form onSubmit={addTodo}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Add a new task..."
                className="w-full p-2 bg-orange-50 text-gray-800 border border-orange-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-200"
              />
              <input
                type="datetime-local"
                value={editDueDate || ''}
                onChange={(e) => setEditDueDate(e.target.value)}
                className="w-full p-2 bg-orange-50 text-gray-800 border border-orange-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-200"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-200"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditDueDate('');
                  }}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for Editing Task */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 w-full max-w-xs">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">Edit Task</h2>
            <form onSubmit={editTodo}>
              <input
                type="text"
                value={editInput}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Edit task..."
                className="w-full p-2 bg-orange-50 text-gray-800 border border-orange-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-200"
              />
              <input
                type="datetime-local"
                value={editDueDate || ''}
                onChange={(e) => setEditDueDate(e.target.value)}
                className="w-full p-2 bg-orange-50 text-gray-800 border border-orange-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-200"
              />
              <input
                type="datetime-local"
                value={editTimestamp || new Date().toISOString().slice(0, 16)}
                onChange={(e) => setEditTimestamp(e.target.value)}
                className="w-full p-2 bg-orange-50 text-gray-800 border border-orange-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-200"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-200"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditDueDate('');
                    setEditTimestamp('');
                  }}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TodoList;