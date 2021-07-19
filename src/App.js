import 'css/App.css';
import { useEffect, useState } from 'react';
import axios from "axios"

function App() {

  const [testValue, setTestValue] = useState(null); // 변수

  const testApi = async () => {
    await axios.get('/api/news')
      .then(response => {
        console.log(response);
      }).catch(err => {console.log(err)});
  }

  useEffect(() => {
    testApi();
  }, [testValue]);

  return (
    <div className="App">
      고건준과 함께 춤을<br></br>
      <button id="test" onClick={testApi}>
        버튼을 누르세요
      </button>
    </div>
  );
}

export default App;
