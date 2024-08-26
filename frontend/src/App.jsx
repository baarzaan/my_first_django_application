import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { routes } from "./routes/Routes"
import Header from "./components/Header"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { getBlogs } from "./featuers/blogSlice"

function App() {
  const dispacth = useDispatch();

  useEffect(() => {
    dispacth(getBlogs());
  }, [dispacth]);

  return (
    <Router>
      <Header />
      <Routes>
        {routes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    </Router>
  )
}

export default App
