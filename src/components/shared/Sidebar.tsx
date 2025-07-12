
import { NavLink } from "react-router-dom";
import { Users, Swords, FolderKanban, Target, Award } from "lucide-react";

const navLinks = [
  {
    to: "/projects/users",
    icon: Users,
    label: "User & Profiles",
  },
  {
    to: "/projects/characters",
    icon: Swords,
    label: "Characters",
  },
  {
    to: "/projects/resources",
    icon: FolderKanban,
    label: "Resources",
  },
  {
    to: "/projects/missions",
    icon: Target,
    label: "Missions",
  },
  {
    to: "/projects/staking-rewards",
    icon: Award,
    label: "Staking Rewards",
  },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 shadow-md">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      </div>
      <nav className="mt-6">
        <ul>
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center px-6 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 ${
                    isActive ? "bg-gray-200 dark:bg-gray-700" : ""
                  }`
                }
              >
                <link.icon className="w-5 h-5 mr-3" />
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
