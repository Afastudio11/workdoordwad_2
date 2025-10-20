import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import DynamicHeader from "@/components/DynamicHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, FileText } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const contentPageSchema = z.object({
  slug: z.string().min(1, "Slug wajib diisi").regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan tanda hubung"),
  title: z.string().min(1, "Title wajib diisi"),
  content: z.string().min(1, "Content wajib diisi"),
  metaDescription: z.string().optional(),
});

type ContentPageForm = z.infer<typeof contentPageSchema>;

interface ContentPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  metaDescription: string | null;
  isPublished: boolean;
  updatedAt: string;
}

export default function AdminContentPagesPage() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<ContentPage | null>(null);

  const { data: pages, isLoading } = useQuery<ContentPage[]>({
    queryKey: ["/api/admin/content"],
  });

  const form = useForm<ContentPageForm>({
    resolver: zodResolver(contentPageSchema),
    defaultValues: {
      slug: "",
      title: "",
      content: "",
      metaDescription: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: ContentPageForm) => apiRequest("/api/admin/content", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/content"] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Berhasil!",
        description: "Content page berhasil dibuat",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Gagal",
        description: error.message || "Gagal membuat content page",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ContentPageForm }) => 
      apiRequest(`/api/admin/content/${id}`, "PATCH", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/content"] });
      setIsDialogOpen(false);
      setEditingPage(null);
      form.reset();
      toast({
        title: "Berhasil!",
        description: "Content page berhasil diupdate",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Gagal",
        description: error.message || "Gagal mengupdate content page",
        variant: "destructive",
      });
    },
  });

  const handleOpenDialog = (page?: ContentPage) => {
    if (page) {
      setEditingPage(page);
      form.reset({
        slug: page.slug,
        title: page.title,
        content: page.content,
        metaDescription: page.metaDescription || "",
      });
    } else {
      setEditingPage(null);
      form.reset();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (data: ContentPageForm) => {
    if (editingPage) {
      updateMutation.mutate({ id: editingPage.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DynamicHeader />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2" data-testid="page-title">
            Content Pages Manager
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Kelola halaman konten seperti Privacy Policy, Terms of Service, dan About Us
          </p>
        </div>

        <div className="mb-6 flex justify-end">
          <Button onClick={() => handleOpenDialog()} data-testid="button-create-page">
            <Plus className="h-4 w-4 mr-2" />
            Buat Content Page
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : !pages || pages.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Belum ada content page</p>
              <Button onClick={() => handleOpenDialog()} data-testid="button-create-first">
                <Plus className="h-4 w-4 mr-2" />
                Buat Content Page Pertama
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {pages.map((page) => (
              <Card key={page.id} data-testid={`card-page-${page.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-gray-700 dark:bg-gray-300 text-white dark:text-black">Content Page</Badge>
                        {page.isPublished ? (
                          <Badge className="bg-black dark:bg-white text-white dark:text-black">Published</Badge>
                        ) : (
                          <Badge variant="secondary">Draft</Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl mb-1">{page.title}</CardTitle>
                      <CardDescription>
                        /{page.slug}
                      </CardDescription>
                      {page.metaDescription && (
                        <p className="text-sm text-gray-600 mt-2">{page.metaDescription}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        Last updated: {new Date(page.updatedAt).toLocaleDateString("id-ID")}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenDialog(page)}
                        data-testid={`button-edit-${page.id}`}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPage ? "Edit Content Page" : "Buat Content Page Baru"}</DialogTitle>
            <DialogDescription>
              {editingPage ? "Update konten halaman" : "Tambahkan halaman konten baru"}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Privacy Policy" data-testid="input-title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="privacy-policy"
                        disabled={!!editingPage}
                        data-testid="input-slug"
                      />
                    </FormControl>
                    {editingPage && (
                      <p className="text-sm text-gray-500">Slug tidak bisa diubah setelah dibuat</p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="metaDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Deskripsi untuk SEO"
                        rows={2}
                        data-testid="input-meta-description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content (HTML) *</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Konten halaman dalam format HTML"
                        rows={15}
                        className="font-mono text-sm"
                        data-testid="input-content"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  data-testid="button-cancel"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  data-testid="button-save"
                >
                  {createMutation.isPending || updateMutation.isPending ? "Menyimpan..." : "Simpan"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
