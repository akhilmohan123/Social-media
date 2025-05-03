
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './Home'
import Signup from './Userdata/Signup';
import Login from './Userdata/Login';
import Logout from './Userdata/Logout';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import Social from './Socialmedia/Social';
import Profile from './Socialmedia/Profile/Profile';
import Friend from './Socialmedia/friends/Friend';
import Addprofile from './Socialmedia/Profile/Addprofile';
import Viewfriend from './Socialmedia/friends/Viewfriend';
import Chat from './Socialmedia/chat/Chat';
import AiChat from './Socialmedia/Aichat';
import Editprofile from './Socialmedia/Profile/Editprofile';
import Viewprofile from './Socialmedia/Profile/Viewprofile';
import { ToastContainer } from 'react-toastify';
function App() {
  return (
    <>
     <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    <Router>
      <Routes>
      <Route exact path='/' element={<Home/>}></Route>
      <Route path='/login' element={<Login/>}></Route>
      <Route path='/logout' element={<Logout/>}></Route>
      <Route path='/signup' element={<Signup/>}></Route>
      <Route path='/social' element={<Social/>}></Route>
      <Route path='/profile' element={<Profile/>}></Route>
      <Route path='/friends' element={<Friend/>}></Route>
      <Route path='/profile-add' element={<Addprofile/>}></Route>
      <Route path='/view-friend/:id' element={<Viewfriend/>}></Route>
      <Route path='/chat-friend/:id' element={<Chat/>}></Route>
      <Route path='/message-ai' element={<AiChat/>}></Route>
      <Route path='/edit-profile' element={<Editprofile/>}></Route>
      <Route path='/view-profile' element={<Viewprofile/>}></Route>
      </Routes>
    </Router>       
    </>
  )
}
export default App