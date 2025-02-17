"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    title: "MANAGEMENT",
    items: [
      {
        icon: "/dashboard.png",
        label: "Dashboard",
        href: "/dashboard",
      },
      {
        icon: "/user.png",
        label: "Users",
        href: "/users",
      },
      {
        icon: "/supplier.png",
        label: "Suppliers",
        href: "/suppliers",
      },
    ],
  },
  {
    title: "SETTINGS",
    items: [
      {
        icon: "/profile.png",
        label: "Profile",
        href: "/profile",
      },
      {
        icon: "/setting.png",
        label: "Settings",
        href: "/settings",
      },
      {
        icon: "/logout.png",
        label: "Logout",
        href: "/logout",
      },
    ],
  },
];

const Sidebar = () => {
  const pathname = usePathname();

  const isActiveItem = (itemHref) => pathname.startsWith(itemHref);

  return (
    <div className="mt-4 text-sm">
      {menuItems.map((section) => (
        <div className="flex flex-col gap-2" key={section.title}>
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {section.title}
          </span>
          {section.items.map((item) => (
            <Link
              href={item.href}
              key={item.label}
              className={`flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-gray-200 ${
                isActiveItem(item.href) ? "font-bold text-black bg-gray-300" : ""
              }`}
            >
              <Image src={item.icon} alt="" width={20} height={20} />
              <span className="hidden lg:block">{item.label}</span>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Sidebar;