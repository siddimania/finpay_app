"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AppShell from "@/components/shared/app-shell";
import {
  createMerchant,
  getAllMerchants,
  type MerchantListItem,
} from "@/server/merchants.actions";
import { Spinner } from "@/components/ui/spinner";
import AppToast, { successToast } from "@/components/shared/app-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOutAction } from "@/server/auth/login.actions";
import { toast } from "sonner";
import { Bug } from "lucide-react";

function formatDate(value: string | null) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  const day = date.toLocaleDateString("en-GB", { day: "numeric" });
  const month = date.toLocaleDateString("en-GB", { month: "long" });
  const year = date.toLocaleDateString("en-GB", { year: "numeric" });

  return `${day} ${month}, ${year}`;
}

export default function Page() {
  const router = useRouter();
  const [merchants, setMerchants] = React.useState<MerchantListItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [, startTransition] = React.useTransition();
  const [isOpen, setIsOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    merchantName: "",
    merchantEmail: "",
    merchantPhone: "",
    merchantAddress: "",
  });

  React.useEffect(() => {
    let isMounted = true;

    async function loadMerchants() {
      setIsLoading(true);
      const result = await getAllMerchants();
      if (!isMounted) {
        return;
      }
      if (result.success) {
        setMerchants(result.data);
      } else {
        setMerchants([]);
      }
      setIsLoading(false);
    }

    void loadMerchants();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const result = await createMerchant({
      merchantName: form.merchantName,
      merchantEmail: form.merchantEmail,
      merchantPhone: form.merchantPhone,
      merchantAddress: form.merchantAddress,
    });

    if (result.success) {
      setForm({
        merchantName: "",
        merchantEmail: "",
        merchantPhone: "",
        merchantAddress: "",
      });
      setIsOpen(false);
      const result = await getAllMerchants();
      if (result.success) {
        setMerchants(result.data);
        successToast("Success, Created", 2000);
      } else {
        setMerchants([]);
      }
    }
  }

  const logoutUser = () => {
    startTransition(async () => {
      const { success, errorMessage } = await signOutAction();
      if (success) {
        router.push("/");
      } else {
        toast.custom((t) => (
          <AppToast
            toastObject={t}
            title="Error !!"
            message={`${errorMessage}`}
            icon={Bug}
            color="bg-red-400"
          />
        ));
      }
    });
  };

  const headerRight = (
    <div className="flex items-center gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar className="h-9 w-9 cursor-pointer">
            <AvatarImage src="/user.png" alt="Account avatar" />
            <AvatarFallback>FP</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={logoutUser}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  return (
    <AppShell activeHref="/merchants" headerRight={headerRight}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Merchants</h1>
          <p className="mt-1 text-sm text-slate-500">Manage all merchants and view their activity.</p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Merchant
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Merchant</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="merchantName">Merchant Name</Label>
                <Input
                  id="merchantName"
                  value={form.merchantName}
                  onChange={(event) => setForm((current) => ({ ...current, merchantName: event.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="merchantEmail">Email</Label>
                <Input
                  id="merchantEmail"
                  type="email"
                  value={form.merchantEmail}
                  onChange={(event) => setForm((current) => ({ ...current, merchantEmail: event.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="merchantPhone">Phone</Label>
                <Input
                  id="merchantPhone"
                  value={form.merchantPhone}
                  onChange={(event) => setForm((current) => ({ ...current, merchantPhone: event.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="merchantAddress">Address</Label>
                <Input
                  id="merchantAddress"
                  value={form.merchantAddress}
                  onChange={(event) => setForm((current) => ({ ...current, merchantAddress: event.target.value }))}
                  required
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Merchant</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="overflow-hidden">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-base font-semibold">All Merchants</h2>
        </div>
        <div className="overflow-x-auto ml-5">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Merchant ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-slate-400">
                    <div className="flex h-[200px] w-full items-center justify-center rounded-xl md:h-[400px]">
                        <Spinner className="size-15 animate-spin stroke-black" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : merchants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-slate-400">
                    No merchants found.
                  </TableCell>
                </TableRow>
              ) : (
                merchants.map((merchant) => (
                  <TableRow
                    key={merchant.merchantId}
                    className="cursor-pointer hover:bg-slate-50"
                    role="button"
                    tabIndex={0}
                    onClick={() => router.push(`/merchants/${merchant.merchantId}`)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        router.push(`/merchants/${merchant.merchantId}`);
                      }
                    }}
                  >
                    <TableCell className="font-medium">{merchant.merchantId}</TableCell>
                    <TableCell>{merchant.merchantName}</TableCell>
                    <TableCell>{merchant.merchantEmail}</TableCell>
                    <TableCell>{merchant.merchantPhone}</TableCell>
                    <TableCell>{merchant.merchantAddress}</TableCell>
                    <TableCell>{formatDate(merchant.createdAt)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </AppShell>
  );
}
