import { Link } from "react-router-dom";

export default function Home() {
  return (<>
  <h1>This is the Homepage</h1>
  <Link to="/second"> Wanna go to the second page?</Link>
  </>)
}