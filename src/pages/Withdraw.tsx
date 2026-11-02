import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Wallet as WalletIcon, Network, Send } from "lucide-react";

const Withdraw = () => {
  const [currency, setCurrency] = useState<string>("");
  const [network, setNetwork] = useState<string>("");
  const [amount, setAmount] = useState("");
  const [destination, setDestination] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-3xl mx-auto px-6 py-12">
        <Link to="/wallet" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Wallet
        </Link>

        <h1 className="text-4xl font-bold mb-2 text-foreground">Withdraw Funds</h1>
        <p className="text-muted-foreground mb-8">
          Withdrawals originate from Solana and are bridged to your selected destination network.
        </p>

        <Card className="overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-destructive to-primary" />
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <Send className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <CardTitle>Withdraw from your wallet</CardTitle>
                <CardDescription>
                  Withdrawals will originate from Solana and be bridged to your selected destination network.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form
              noValidate
              className="space-y-5"
              onSubmit={(event) => {
                event.preventDefault();
                // Withdrawal processing handled by backend
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="currency" className="flex items-center gap-2">
                  <WalletIcon className="w-4 h-4 text-muted-foreground" />
                  Currency
                </Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USDC">USDC</SelectItem>
                    <SelectItem value="USDT">USDT</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="network" className="flex items-center gap-2">
                  <Network className="w-4 h-4 text-muted-foreground" />
                  Destination Network
                </Label>
                <Select value={network} onValueChange={setNetwork}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination network" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solana">Solana</SelectItem>
                    <SelectItem value="ethereum">Ethereum</SelectItem>
                    <SelectItem value="base">Base</SelectItem>
                    <SelectItem value="polygon">Polygon</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Supported networks will be provided by the backend.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="destination">Destination Address</Label>
                <Input
                  id="destination"
                  type="text"
                  placeholder="Destination wallet address"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Enter a destination wallet address on the selected network. Withdrawal processing is not connected.
                </p>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> Fees, settlement times, and minimum amounts will be provided by the backend.
                </p>
              </div>

              <Button type="submit" className="w-full">
                Preview withdrawal
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Withdraw;