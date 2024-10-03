import React, { useEffect } from 'react'
import Home from "./pages/Home"
import Navbar from "./components/Navbar/Navbar"
import Footer from "./components/Footer/Footer"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import AllBooks from './pages/AllBooks'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Cart from './pages/Cart'
import ViewBookDetails from './components/ViewBookDetails/ViewBookDetails'
import { useDispatch, useSelector } from 'react-redux'
import { authActions } from './components/store/auth'
import Favourites from './components/Profile/Favourites'
import UserOrderHistory from './components/Profile/UserOrderHistory'
import Settings from './components/Profile/Settings'
import AddBook from './pages/AddBook'
import AllOrder from "./pages/AllOrder"
import UpdateBook from './pages/UpdateBook'
const App = () => {
  const dispatch = useDispatch()
  const role = useSelector((state) => state.auth.role)
  useEffect(() => {
    if (
      localStorage.getItem("id") &&
      localStorage.getItem("token") &&
      localStorage.getItem("role")
    ) {
      dispatch(authActions.login())
      dispatch(authActions.changeRole(localStorage.getItem("role")))
    }
  }, [])
  return (
    <div>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/all-books" element={<AllBooks />} />

        <Route path="/Cart" element={<Cart />} />

        <Route path="/Profile" element={<Profile />}>

          {role === "user" ? <Route index element={<Favourites />} /> : <Route index element={<AllOrder />} /> }
          {role === "admin" && <Route path="/Profile/add-book" element={<AddBook />} />}
          <Route path="settings" element={<Settings />} />
          <Route path="orderHistory" element={<UserOrderHistory />} />

        </Route>
        <Route path="/view-book-details/:id" element={<ViewBookDetails />} />
        <Route path="/updateBook/:id" element={<UpdateBook />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App