import { FaRegCircleUser } from "react-icons/fa6";
import { Link, useLocation } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";

// TODO change the colors/theme of the navbar/app
export default function Navigation() {
  const { pathname } = useLocation();
  // TODO add real icons
  const links = [
    { label: "Account", path: "profile", icon: FaRegCircleUser },
    { label: "Daily", path: "/wordle", icon: FaRegCircleUser }, 
    { label: "Tournaments", path: "tournaments", icon: FaRegCircleUser },
    { label: "Leaderboard", path: "leaderboard", icon: FaRegCircleUser },
    { label: "Settings", path: "settings", icon: FaRegCircleUser },
  ];

  return (
    <Navbar
      bg="black"
      variant="dark"
      expand="md"
      sticky="top"
      className="px-3 py-2 z-2"
    >
      <Container fluid>
        <Navbar.Brand className="text-danger">Social Wordle</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">
            {links.map((link) => {
              const isActive = pathname.includes(link.path);
              return (
                <Nav.Link
                  as={Link}
                  to={link.path}
                  key={link.label}
                  className={`d-flex align-items-center gap-2 ${
                    isActive ? "text-danger" : "text-white"
                  }`}
                >
                  {link.icon({ className: "fs-5" })}
                  {link.label}
                </Nav.Link>
              );
            })}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
