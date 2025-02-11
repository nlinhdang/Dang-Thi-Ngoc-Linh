import './App.css';
import Input from './Input';


function App() {
  return (
    <div className='container'>
      <h1>Money swap</h1>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="white-container">
          <Input />
        </div>
        
      </form>
    </div>
  );
}

export default App;
