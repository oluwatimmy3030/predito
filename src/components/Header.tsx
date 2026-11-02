import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus, LogOut, User, Menu, Home, BarChart3, Wallet, ArrowDownToLine, ArrowUpFromLine, TrendingUp, History, DollarSign } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/signin');
  };

  const handleNavClick = () => {
    setIsOpen(false);
  };

  const authNavLinks = [
    { to: "/", label: "Home", icon: Home },
    { to: "/markets", label: "Markets", icon: BarChart3 },
    { to: "/wallet", label: "Wallet", icon: Wallet },
    { to: "/deposit", label: "Deposit", icon: ArrowDownToLine },
    { to: "/withdraw", label: "Withdraw", icon: ArrowUpFromLine },
    { to: "/positions", label: "Positions", icon: TrendingUp },
    { to: "/trades", label: "Trades", icon: History },
    { to: "/pnl", label: "P&L", icon: DollarSign },
  ];

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <img src="/predito-logo.svg" alt="" className="w-10 h-10 transition-transform group-hover:scale-105" />
            <span className="text-2xl font-bold text-foreground tracking-tight">Predito</span>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="hidden lg:flex">
              <Link to="/markets">Markets</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link to="/wallet">Wallet</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="hidden lg:flex">
              <Link to="/deposit">Deposit</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="hidden lg:flex">
              <Link to="/withdraw">Withdraw</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="hidden lg:flex">
              <Link to="/positions">Positions</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="hidden xl:flex">
              <Link to="/trades">Trades</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="hidden xl:flex">
              <Link to="/pnl">P&L</Link>
            </Button>

            {isAuthenticated ? (
              <>
                <div className="h-6 w-px bg-border mx-2" />
                <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{user?.email || "User"}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </>
            ) : (
              <Button asChild size="sm" className="gap-2">
                <Link to="/signin">
                  <LogIn className="w-4 h-4" />
                  Sign In / Sign Up
                </Link>
              </Button>
            )}
          </div>

          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[320px]">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-xl font-bold text-foreground">Menu</span>
                  </div>

                  {isAuthenticated && user && (
                    <div className="flex items-center gap-3 px-2 py-3 mb-4 bg-muted rounded-lg">
                      <User className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium text-foreground">{user.email || "User"}</span>
                    </div>
                  )}

                  <nav className="flex flex-col gap-1 flex-1">
                    {authNavLinks.map((link) => (
                      <SheetClose asChild key={link.to}>
                        <Link
                          to={link.to}
                          onClick={handleNavClick}
                          className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-muted transition-colors text-foreground"
                        >
                          <link.icon className="w-5 h-5 text-muted-foreground" />
                          <span className="font-medium">{link.label}</span>
                        </Link>
                      </SheetClose>
                    ))}
                  </nav>

                  <div className="border-t border-border pt-4 mt-4">
                    {isAuthenticated ? (
                      <Button
                        variant="outline"
                        className="w-full gap-2"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </Button>
                    ) : (
                      <SheetClose asChild>
                        <Button asChild className="w-full gap-2">
                          <Link to="/signin" onClick={handleNavClick}>
                            <LogIn className="w-4 h-4" />
                            Sign In / Sign Up
                          </Link>
                        </Button>
                      </SheetClose>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;