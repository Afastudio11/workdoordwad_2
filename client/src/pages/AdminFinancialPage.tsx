import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AdminFinancialPage() {
  const { toast } = useToast();
  const [isRefundOpen, setIsRefundOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [refundReason, setRefundReason] = useState("");

  const { data: revenueStats } = useQuery({
    queryKey: ["/api/admin/revenue-stats"],
  });

  const { data: transactionsData, isLoading } = useQuery({
    queryKey: ["/api/admin/transactions"],
  });

  const handleRefund = async () => {
    if (!selectedTransaction || !refundReason.trim()) {
      toast({
        variant: "destructive",
        title: "Validasi Gagal",
        description: "Alasan refund harus diisi",
      });
      return;
    }

    try {
      await apiRequest(`/api/admin/transactions/${selectedTransaction.id}/refund`, "POST", {
        reason: refundReason,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/revenue-stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/dashboard/stats"] });
      toast({
        title: "Refund Berhasil",
        description: "Transaksi telah direfund",
      });
      setIsRefundOpen(false);
      setRefundReason("");
      setSelectedTransaction(null);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Gagal Refund",
        description: error.message || "Terjadi kesalahan saat memproses refund",
      });
    }
  };

  const transactions = transactionsData?.transactions || [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-black dark:text-white" data-testid="heading-financial">
            Manajemen Keuangan
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Laporan pendapatan dan riwayat transaksi
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Pendapatan
              </CardTitle>
              <DollarSign className="w-5 h-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary" data-testid="stat-total-revenue">
                Rp {(revenueStats?.totalRevenue || 0).toLocaleString('id-ID')}
              </div>
            </CardContent>
          </Card>

          {revenueStats?.transactionsByType?.map((stat: any) => (
            <Card
              key={stat.type}
              className="bg-white dark:bg-black border-gray-200 dark:border-gray-800"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.type === 'job_booster' ? 'Job Booster' : 'Slot Package'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-black dark:text-white">
                  Rp {stat.amount.toLocaleString('id-ID')}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {stat.count} transaksi
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-black dark:text-white">
              Riwayat Transaksi
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="rounded-md border border-gray-200 dark:border-gray-800">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 dark:bg-gray-900">
                      <TableHead className="text-black dark:text-white font-semibold">
                        ID Transaksi
                      </TableHead>
                      <TableHead className="text-black dark:text-white font-semibold">
                        Pengguna
                      </TableHead>
                      <TableHead className="text-black dark:text-white font-semibold">
                        Produk
                      </TableHead>
                      <TableHead className="text-black dark:text-white font-semibold">
                        Jumlah
                      </TableHead>
                      <TableHead className="text-black dark:text-white font-semibold">
                        Status
                      </TableHead>
                      <TableHead className="text-black dark:text-white font-semibold">
                        Tanggal
                      </TableHead>
                      <TableHead className="text-black dark:text-white font-semibold">
                        Aksi
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.length > 0 ? (
                      transactions.map((txn: any) => (
                        <TableRow key={txn.id} data-testid={`transaction-row-${txn.id}`}>
                          <TableCell className="font-mono text-xs text-gray-600 dark:text-gray-400">
                            {txn.id.slice(0, 8)}...
                          </TableCell>
                          <TableCell className="text-black dark:text-white">
                            <div>
                              <p className="font-medium">{txn.userName}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-500">
                                {txn.userEmail}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-600 dark:text-gray-400">
                            {txn.type === 'job_booster' ? 'Job Booster' : 'Slot Package'}
                          </TableCell>
                          <TableCell className="font-semibold text-black dark:text-white">
                            Rp {txn.amount.toLocaleString('id-ID')}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                txn.status === 'completed'
                                  ? "default"
                                  : txn.status === 'refunded'
                                  ? "secondary"
                                  : "outline"
                              }
                              className={
                                txn.status === 'completed' ? "bg-primary text-black" : ""
                              }
                            >
                              {txn.status === 'completed'
                                ? 'Success'
                                : txn.status === 'refunded'
                                ? 'Refunded'
                                : txn.status === 'failed'
                                ? 'Failed'
                                : 'Pending'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-600 dark:text-gray-400">
                            {new Date(txn.createdAt).toLocaleDateString('id-ID')}
                          </TableCell>
                          <TableCell>
                            {txn.status === 'completed' && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => {
                                  setSelectedTransaction(txn);
                                  setIsRefundOpen(true);
                                }}
                                data-testid={`button-refund-${txn.id}`}
                              >
                                Refund
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center text-gray-500 dark:text-gray-500 py-8"
                        >
                          Tidak ada transaksi
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isRefundOpen} onOpenChange={setIsRefundOpen}>
        <DialogContent className="bg-white dark:bg-black border-gray-200 dark:border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-black dark:text-white">
              Proses Refund
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Masukkan alasan refund untuk transaksi ini
            </DialogDescription>
          </DialogHeader>

          {selectedTransaction && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p className="text-gray-600 dark:text-gray-400">Pengguna:</p>
                  <p className="font-medium text-black dark:text-white">
                    {selectedTransaction.userName}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">Jumlah:</p>
                  <p className="font-medium text-black dark:text-white">
                    Rp {selectedTransaction.amount.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="refundReason" className="text-black dark:text-white">
                  Alasan Refund *
                </Label>
                <Textarea
                  id="refundReason"
                  placeholder="Masukkan alasan refund..."
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="bg-white dark:bg-black border-gray-200 dark:border-gray-800"
                  data-testid="input-refund-reason"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsRefundOpen(false);
                setRefundReason("");
                setSelectedTransaction(null);
              }}
            >
              Batal
            </Button>
            <Button
              className="bg-primary text-black hover:bg-primary/90"
              onClick={handleRefund}
              data-testid="button-confirm-refund"
            >
              Proses Refund
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
