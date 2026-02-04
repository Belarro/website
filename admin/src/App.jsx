import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import ProductEdit from './pages/ProductEdit'
import Kitchens from './pages/Kitchens'
import KitchenEdit from './pages/KitchenEdit'
import Users from './pages/Users'
import UserEdit from './pages/UserEdit'
import ChefOrder from './pages/ChefOrder'
import Submissions from './pages/Submissions'

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />

      {/* Protected routes with layout */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/chef" element={<ChefOrder />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductEdit />} />
        <Route path="/kitchens" element={<Kitchens />} />
        <Route path="/kitchens/:id" element={<KitchenEdit />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<UserEdit />} />
        <Route path="/submissions" element={<Submissions />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
