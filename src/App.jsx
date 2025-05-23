import TodoList from './components/TodoList';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-500 via-blue-400 to-orange-600 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white/80 rounded-xl shadow-lg overflow-hidden backdrop-blur-sm">
        <TodoList />
      </div>
    </div>
  );
}

export default App;