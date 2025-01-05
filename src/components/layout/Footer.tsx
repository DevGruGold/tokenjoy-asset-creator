import { Shield, Database, CreditCard } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-xmrt-dark text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-xmrt-light" />
            <span>Secure Asset Management</span>
          </div>
          <div className="flex items-center space-x-2">
            <Database className="h-6 w-6 text-xmrt-light" />
            <span>Blockchain Technology</span>
          </div>
          <div className="flex items-center space-x-2">
            <CreditCard className="h-6 w-6 text-xmrt-light" />
            <span>Digital Tokenization</span>
          </div>
        </div>
        <div className="border-t border-xmrt-hover pt-4 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} XMRT Asset Tokenizer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;