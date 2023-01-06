import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <>
      <h1>Index page</h1>
      <ul>
        <li>
          <Link to="/auth/private">Go to private page</Link>
        </li>
        <li>
          <Link to="/auth/login">Go to login page</Link>
        </li>
        <li>
          <Link to="/auth/register">Go to register page</Link>
        </li>
      </ul>
    </>
  );
}
