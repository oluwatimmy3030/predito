import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft, Copy, Wallet as WalletIcon, Landmark } from "lucide-react";
import { walletService, DepositAddress } from "@/services/walletService";

const Deposit = () => {
  const { token } = useAuth();
  const [depositAddresses, setDepositAddresses] = useState<DepositAddress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchAddresses = async () => {
      try {
        setLoading(true);
        const addresses = await walletService.getDepositAddresses(token || undefined);
        setDepositAddresses(addresses);
      } catch (error) {
        toast.error("Failed to load deposit addresses");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [token]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Address copied to clipboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-12">
        <Link to="/wallet" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Wallet
        </Link>

        <h1 className="text-4xl font-bold mb-2 text-foreground">Deposit Funds</h1>
        <p className="text-muted-foreground mb-8">
          Add funds to your account. All deposits are settled on Solana.
        </p>

        <div className="space-y-6">
          <Card className="overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-primary to-accent" />
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Landmark className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Fiat deposits</CardTitle>
                  <CardDescription>
                    Add funds through a supported fiat-to-crypto provider.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Fiat onramp options will appear here when supported providers are configured.
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-success to-primary" />
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <WalletIcon className="w-6 h-6 text-success" />
                </div>
                <div>
                  <CardTitle>External crypto wallet</CardTitle>
                  <CardDescription>
                    Deposit using an address for an asset and network supported by your account.
                    Eligible deposits will be bridged to Solana for platform settlement.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {depositAddresses.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No deposit addresses available
                </p>
              ) : (
                <div className="space-y-4">
                  {depositAddresses.map((addr) => (
                    <div key={addr.currency} className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-foreground">{addr.currency}</h3>
                        <span className="text-sm text-muted-foreground">{addr.network}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 p-2 bg-muted rounded text-sm font-mono break-all">
                          {addr.address}
                        </code>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => copyToClipboard(addr.address)}
                          aria-label={`Copy ${addr.currency} deposit address`}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> Only send assets over the networks shown above.
                  Sending unsupported assets or using a different network may result in loss of funds.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Deposit;