/**
 * IMPORTANT: THIS IS AN ADMIN-ONLY PAGE
 * - MUST USE: AdminLayout (NOT DashboardHeader or DynamicHeader)
 * - ROLE REQUIRED: admin
 * - ROUTE: /admin/blog
 * - DO NOT import worker or employer components
 */
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye, EyeOff, Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const blogPostSchema = z.object({
  slug: z.string().min(1, "Slug wajib diisi").regex(/^[a-z0-9-]+$/, "Slug hanya boleh huruf kecil, angka, dan tanda hubung"),
  title: z.string().min(1, "Title wajib diisi"),
  excerpt: z.string().min(1, "Excerpt wajib diisi"),
  content: z.string().min(1, "Content wajib diisi"),
  heroImage: z.string().optional(),
  category: z.enum(["Newsletter", "Tips", "Insight", "Success Stories"]),
  tags: z.string().optional(),
  readTime: z.string().optional(),
});

type BlogPostForm = z.infer<typeof blogPostSchema>;

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  heroImage: string | null;
  category: string;
  tags: string[] | null;
  readTime: string | null;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function AdminBlogManagerPage() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const { data: blogData, isLoading } = useQuery<{ posts: BlogPost[]; total: number }>({
    queryKey: ["/api/admin/blog"],
  });

  const form = useForm<BlogPostForm>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      slug: "",
      title: "",
      excerpt: "",
      content: "",
      heroImage: "",
      category: "Newsletter",
      tags: "",
      readTime: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: BlogPostForm) => {
      const payload = {
        ...data,
        tags: data.tags ? data.tags.split(",").map(t => t.trim()) : [],
      };
      return apiRequest("/api/admin/blog", "POST", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog"] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Berhasil!",
        description: "Blog post berhasil dibuat",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Gagal",
        description: error.message || "Gagal membuat blog post",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: BlogPostForm }) => {
      const payload = {
        ...data,
        tags: data.tags ? data.tags.split(",").map(t => t.trim()) : [],
      };
      return apiRequest(`/api/admin/blog/${id}`, "PATCH", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog"] });
      setIsDialogOpen(false);
      setEditingPost(null);
      form.reset();
      toast({
        title: "Berhasil!",
        description: "Blog post berhasil diupdate",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Gagal",
        description: error.message || "Gagal mengupdate blog post",
        variant: "destructive",
      });
    },
  });

  const publishMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/admin/blog/${id}/publish`, "POST"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog"] });
      toast({
        title: "Berhasil!",
        description: "Blog post berhasil dipublish",
      });
    },
  });

  const unpublishMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/admin/blog/${id}/unpublish`, "POST"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog"] });
      toast({
        title: "Berhasil!",
        description: "Blog post berhasil di-unpublish",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/admin/blog/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog"] });
      toast({
        title: "Berhasil!",
        description: "Blog post berhasil dihapus",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Gagal",
        description: error.message || "Gagal menghapus blog post",
        variant: "destructive",
      });
    },
  });

  const handleOpenDialog = (post?: BlogPost) => {
    if (post) {
      setEditingPost(post);
      form.reset({
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        heroImage: post.heroImage || "",
        category: post.category as any,
        tags: post.tags?.join(", ") || "",
        readTime: post.readTime || "",
      });
    } else {
      setEditingPost(null);
      form.reset();
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (data: BlogPostForm) => {
    if (editingPost) {
      updateMutation.mutate({ id: editingPost.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const filteredPosts = blogData?.posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || post.category === categoryFilter;
    return matchesSearch && matchesCategory;
  }) || [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-black dark:text-white mb-2" data-testid="page-title">
            Blog Manager
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Kelola konten blog untuk website Pintu Kerja
          </p>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Cari blog post..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[200px]" data-testid="select-category-filter">
                <SelectValue placeholder="Semua Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                <SelectItem value="Newsletter">Newsletter</SelectItem>
                <SelectItem value="Tips">Tips</SelectItem>
                <SelectItem value="Insight">Insight</SelectItem>
                <SelectItem value="Success Stories">Success Stories</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => handleOpenDialog()} data-testid="button-create-post">
            <Plus className="h-4 w-4 mr-2" />
            Buat Blog Post
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">Tidak ada blog post ditemukan</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {filteredPosts.map((post) => (
              <Card key={post.id} data-testid={`card-blog-${post.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{post.category}</Badge>
                        {post.isPublished ? (
                          <Badge className="bg-black dark:bg-white text-white dark:text-black">Published</Badge>
                        ) : (
                          <Badge variant="secondary">Draft</Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl mb-1">{post.title}</CardTitle>
                      <CardDescription>{post.excerpt}</CardDescription>
                      <div className="mt-2 text-sm text-gray-500">
                        Slug: /{post.slug}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      {post.isPublished ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => unpublishMutation.mutate(post.id)}
                          data-testid={`button-unpublish-${post.id}`}
                        >
                          <EyeOff className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => publishMutation.mutate(post.id)}
                          data-testid={`button-publish-${post.id}`}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleOpenDialog(post)}
                        data-testid={`button-edit-${post.id}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          if (confirm("Yakin ingin menghapus blog post ini?")) {
                            deleteMutation.mutate(post.id);
                          }
                        }}
                        data-testid={`button-delete-${post.id}`}
                      >
                        <Trash2 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPost ? "Edit Blog Post" : "Buat Blog Post Baru"}</DialogTitle>
            <DialogDescription>
              {editingPost ? "Update informasi blog post" : "Tambahkan blog post baru ke website"}
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
                      <Input {...field} placeholder="Judul blog post" data-testid="input-title" />
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
                      <Input {...field} placeholder="url-friendly-slug" data-testid="input-slug" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger data-testid="select-category">
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Newsletter">Newsletter</SelectItem>
                        <SelectItem value="Tips">Tips</SelectItem>
                        <SelectItem value="Insight">Insight</SelectItem>
                        <SelectItem value="Success Stories">Success Stories</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Excerpt *</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Ringkasan singkat blog post"
                        rows={3}
                        data-testid="input-excerpt"
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
                        placeholder="Konten blog dalam format HTML"
                        rows={10}
                        className="font-mono text-sm"
                        data-testid="input-content"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="heroImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hero Image URL</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://example.com/image.jpg" data-testid="input-hero-image" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags (comma separated)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="tag1, tag2, tag3" data-testid="input-tags" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="readTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Read Time</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="5 min read" data-testid="input-read-time" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
    </AdminLayout>
  );
}
