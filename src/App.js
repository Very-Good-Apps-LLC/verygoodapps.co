import { createHashRouter, RouterProvider } from 'react-router-dom'
import Home from './Pages/Home'
import PrivacyPolicy from './Pages/PrivacyPolicy'

function App() {
  const router = createHashRouter([
    {
      path: '/',
      element: <Home />,
      errorElement: <div>404 Not Found</div>
    },
    {
      path:'/privacy-policy',
      element: <PrivacyPolicy />
    }
  ])

  return (
    <>
        <RouterProvider router={router} />
    </>
  )
}

export default App;
