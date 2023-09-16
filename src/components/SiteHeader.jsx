"use client";
import { useState, useRef, useEffect } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export default function SiteHeader() {
  const [SidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  const Sidebar = () => {
    return (
      <div
        ref={sidebarRef}
        className="absolute flex flex-col z-50 h-screen w-48 bg-red-300"
      >
        e+
        <button
          onClick={() => setSidebarOpen(false)}
          className="rounded-lg border border-slate-200 p-2 h-8 w-8 flex items-center"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>
    );
  };

  // Close Sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <header className="flex items-center w-full col-span-full bg-slate-400 h-12">
        <button onClick={() => setSidebarOpen(true)}>
          <Bars3Icon className="h-6 w-6" />
        </button>
        <span>e+</span>
      </header>
      {SidebarOpen && <Sidebar />}
    </>
  );
}
