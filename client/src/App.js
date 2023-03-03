import './App.css';
import Dashboard from './components/Dashboard';
import Auth from './components/Auth';
import Cookies from 'js-cookie'
import {Routes, Route} from 'react-router-dom'

function App() {
  const cookie = Cookies.get('')
  return (
    <>
      <Routes>
        <Route path='*' element={cookie ? <Dashboard/> : <Auth/>}></Route>
        <Route path='/auth' element={<Auth/>}/>
      </Routes>
    </>
  );
}

export default App;
