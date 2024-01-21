import {BrowserRouter,Route,Routes} from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Profile from './pages/Profile'
import Header from './components/Header'
import PrivateRoute from './components/PrivateRoute'
import CreateListing from './pages/CreateListing'
import UpdateListing from './pages/UpdateListing'
import Listing from './pages/Listing'
import SearchList from './pages/SearchList'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* Public Routes */}
        <Route path='/' element = { <Home/> } />
        <Route path='/about' element = { <About/> } />
        <Route path='/sign-in' element = { <SignIn/> } />
        <Route path='/sign-up' element = { <SignUp/> } />
        <Route path='/search' element = { <SearchList/> } />
        <Route path='/listing/:listId' element = { <Listing/> } />
        <Route path='/forgotpasswordemail' element={ <ForgotPassword/> } />
        <Route path='/resetpassword/:id/:token' element={ <ResetPassword/> } />
        {/* Private Routes */}
        <Route element = { <PrivateRoute/> }>
          <Route path='/profile' element = { <Profile/> } />
          <Route path='/create-listing' element = { <CreateListing/> } />
          <Route path='/update-listing/:listingId' element={<UpdateListing/>} />
        </Route>

      </Routes>  
    </BrowserRouter>
  )
}

export default App
