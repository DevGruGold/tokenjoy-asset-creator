import React from 'react';
import WalletIndicator from '../wallet/WalletIndicator';

const Header = () => {
  return (
    <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <div className="flex gap-6 md:gap-10">
          <a href="/" className="flex items-center space-x-2">
            <span className="font-bold inline-block">XMRT Asset Tokenizer</span>
          </a>
        </div>
        <WalletIndicator />
      </div>
    </header>
  );
};

export default Header;