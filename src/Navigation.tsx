import { FaRegCircleUser } from "react-icons/fa6";
import { Link, useLocation } from "react-router-dom";
import { ListGroup } from "react-bootstrap";
export default function Navigation() {
  const { pathname } = useLocation();
  const links = [
    { label: "Account", path: "profile", icon: FaRegCircleUser },
    { label: "Daily", path: "/", icon: FaRegCircleUser },
    { label: "Tournaments", path: "tournaments", icon: FaRegCircleUser },
    { label: "Past Worldes", path: "past", icon: FaRegCircleUser },
    { label: "Friends", path: "friends", icon: FaRegCircleUser },
    { label: "Settings", path: "settings", icon: FaRegCircleUser },
    { label: "Logout", path: "logout", icon: FaRegCircleUser },
    { label: "Help", path: "help", icon: FaRegCircleUser },
  ];
  return (
    <ListGroup
      style={{ width: 120 }}
      className="rounded-0 position-fixed bottom-0 top-0 d-none d-md-block bg-black z-2"
    >
      {links.map((link) => (
        <ListGroup.Item
          key={link.label}
          as={Link}
          to={link.path}
          className={`bg-black text-center border-0
              ${
                pathname.includes(link.label)
                  ? "text-danger bg-white"
                  : "text-white bg-black"
              }`}
        >
          {link.icon({ className: "fs-1 text-danger" })}
          <br />
          {link.label}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}
