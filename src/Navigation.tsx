import { FaRegCircleUser } from "react-icons/fa6";
import { Link, useLocation } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import { BsCalendar, BsTrophy } from "react-icons/bs";
import { MdOutlineLeaderboard } from "react-icons/md";
import { FaPencilAlt } from "react-icons/fa";

// TODO change the colors/theme of the navbar/app
export default function Navigation() {
  const { pathname } = useLocation();
  const links = [
    { label: "Account", path: "profile", icon: FaRegCircleUser },
    { label: "Daily", path: "/wordle", icon: BsCalendar },
    { label: "Custom", path: "/wordle/custom", icon: FaPencilAlt },
    { label: "Tournaments", path: "tournaments", icon: BsTrophy },
    { label: "Leaderboard", path: "leaderboard", icon: MdOutlineLeaderboard },
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
              const isActive = link.label === "Daily" ? pathname.includes(link.path) && !pathname.includes('custom') : pathname.includes(link.path);
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
