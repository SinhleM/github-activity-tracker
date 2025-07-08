import React from 'react';
import { Github } from 'lucide-react'; // Example icon

const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4 shadow-md"> {/* No rounded corners */}
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Application Title/Logo */}
        <div className="flex items-center space-x-3">
          <Github className="h-8 w-8 text-white" />
          <h1 className="text-2xl font-bold">GitHub Dashboard</h1>
        </div>

        {/* Optional: Navigation or User Info (can be expanded later) */}
        <nav>
          {/* Example: A simple link */}
          {/* <a href="#" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium">
            About
          </a> */}
        </nav>
      </div>
    </header>
  );
};

export default Header;