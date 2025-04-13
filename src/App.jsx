import { Children } from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import MainLayout from "./layout/MainLayout"
import Stations from "./pages/Stations"
import SessionHistory from "./pages/SessionHistory"
import AdminPanel from "./pages/AdminPanel"



function App() {
  const routes = createBrowserRouter([{
    path: "/",
    element: <MainLayout />,
    children:[
      {index:true,
        element: <Stations/>
      },
      {
        path: "/session/history",
        element: <SessionHistory/>
      },
      {path: "/station",
        element:<Stations/>
      },{
        path:"/AdminPanel",
        element: <AdminPanel />
       }
    ]
  }])
  return (
<RouterProvider router={routes} />
  )
}

export default App