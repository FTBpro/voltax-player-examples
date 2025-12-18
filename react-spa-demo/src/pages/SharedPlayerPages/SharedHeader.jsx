import { NavLink, useParams } from 'react-router-dom';

export function SharedHeader() {
  return (
    <div>
      <h2 style={{ textTransform: 'capitalize' }}>Shared Player between multiple routes</h2>
      <p>
        Demonstrates reusing the same player instance between multiple routes. 
        We use the same instance and inject it into different containers.
      </p>
      <nav className="nav-links flex-row">
        <NavLink to="/shared/page-one"  end>
          Page One
        </NavLink>
        <NavLink to="/shared/page-two" >
          Page Two
        </NavLink>
      </nav>
    </div>
  );
}
