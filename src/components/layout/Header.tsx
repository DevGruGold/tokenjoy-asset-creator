import { Coins } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-xmrt-brand to-xmrt-hover text-white py-4 px-6 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Coins className="h-8 w-8" />
          <div>
            <h1 className="text-2xl font-bold">XMRT Asset Tokenizer</h1>
            <p className="text-sm opacity-90">Secure Digital Asset Management</p>
          </div>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#" className="hover:opacity-80 transition-opacity">Documentation</a>
          <a href="#" className="hover:opacity-80 transition-opacity">Support</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;