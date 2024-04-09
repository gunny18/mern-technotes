import { Link } from "react-router-dom";

const Public = () => {
  return (
    <section className="public">
      <header>
        <h1>
          Welcome to <span className="nowrap">Dan D. Repaires!</span>
        </h1>
      </header>
      <main className="public__main">
        <p>
          Located in Beautiful downtown Foo Cit, Dan D. Repairs provides a
          trained staff ready to meet your tech repair needs.
        </p>
        <address className="public__addr">
          Dan D. Repairs <br />
          555 Foo Drive <br />
          Foo City, CA 12345 <br />
          <a href="tel:+1555555555">(555) 555-5555</a>
        </address>
        <br />
        <p>Owner: Dan Davidson</p>
        <footer>
          <Link to="/login">Employee Login</Link>
        </footer>
      </main>
    </section>
  );
};

export default Public;
