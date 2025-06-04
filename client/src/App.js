import './App.css';
import Header from './components/Header';

function App() {
  return (
    <div>
      <div className="pt-24 px-4 bg-black">
        <h1 className="text-3xl font-bold mb-4">Hello</h1>
        <p className="mb-10">
          Scroll down to see the header background change.
        </p>
        <div className="h-[2000px] bg-gray-100 p-4 rounded">
          <p>
            This is just filler content to test the scroll behavior of the
            header.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
