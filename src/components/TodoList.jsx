import { useState } from 'react';
import { FiMenu, FiEdit, FiTrash2 } from 'react-icons/fi'; // Ensure react-icons is installed

function TodoList() {
  const [todos, setTodos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [input, setInput] = useState('');

  const addTodo = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setTodos([...todos, { id: Date.now(), text: input, completed: false }]);
    setInput('');
    setIsModalOpen(false);
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

  return (
    <div className="bg-gradient-to-b from-orange-200 to-orange-400">
      {/* Header */}
      <div className="flex items-center justify-between bg-blue-600 p-3">
        <FiMenu className="text-white h-6 w-6" />
        <h1 className="text-white text-lg font-semibold">Todo List</h1>
        <div className="w-6" /> {/* Spacer for alignment */}
      </div>

      {/* Todo List */}
      <div className="p-4">
        {todos.length === 0 ? (
          <p className="text-gray-600 text-center">No tasks yet. Add one!</p>
        ) : (
          <ul className="space-y-3">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center justify-between p-3 bg-white/50 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 animate-fadeIn"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="h-5 w-5 text-blue-500 rounded focus:ring-blue-400"
                  />
                  <span
                    className={`${
                      todo.completed ? 'line-through text-gray-500' : 'text-gray-800'
                    } text-lg`}
                  >
                    {todo.text}
                  </span>
                </div>
                <div className="flex gap-2">
                  <FiEdit className="h-5 w-5 text-gray-600 cursor-pointer hover:text-blue-600 transition duration-200" />
                  <FiTrash2
                    onClick={() => deleteTodo(todo.id)}
                    className="h-5 w-5 text-gray-600 cursor-pointer hover:text-red-600 transition duration-200"
                  />
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* New Task Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-full flex items-center justify-center gap-2 hover:bg-blue-700 transition duration-200"
        >
          <span className="text-lg">+</span> New task
        </button>
      </div>

      {/* Modal for Adding New Task */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 w-full max-w-xs">
            <h2 className="text-lg font-semibold mb-3">Add New Task</h2>
            <form onSubmit={addTodo}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Add a new task..."
                className="w-full p-2 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition duration-200"
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