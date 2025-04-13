import { Link } from "react-router-dom"

function Navbar() {
  return (
    <nav className="navbar">
    <div className="logo">GCM</div>
    <div className="nav-links">
      <Link to="/station" className="active">Stations</Link>
      <Link to="/session/history">Session History</Link>
      <Link to="/AdminPanel">Admin Panel</Link>
    </div>
    <div className="user-profile">
      <span>Admin</span>
      <div className="profile-pic"></div>
    </div>
  </nav>
  )
}

export default Navbar