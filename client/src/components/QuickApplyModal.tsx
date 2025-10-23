import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, ArrowLeft, ArrowRight, FileText, Mail, Phone, User, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface QuickApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  jobTitle?: string;
  companyName?: string;
}

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  resume: string;
  resumeUrl: string;
}

export function QuickApplyModal({ isOpen, onClose, jobId, jobTitle, companyName }: QuickApplyModalProps) {
  const [step, setStep] = useState(0);
  const [coverLetter, setCoverLetter] = useState("");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const { toast } = useToast();

  const checkCanApplyMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest(`/api/jobs/${jobId}/quick-apply`, "POST");
      return await response.json();
    },
    onSuccess: (data: any) => {
      if (data.canApply) {
        setUserProfile(data.userProfile);
        setStep(1);
      } else {
        toast({
          title: "Tidak dapat melamar",
          description: data.error || "Anda sudah melamar ke lowongan ini",
          variant: "destructive",
        });
        onClose();
      }
    },
    onError: (error: any) => {
      toast({
        title: "Terjadi kesalahan",
        description: error.message || "Gagal memuat data profil",
        variant: "destructive",
      });
      onClose();
    },
  });

  const submitApplicationMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest(`/api/jobs/${jobId}/apply`, "POST", { coverLetter });
      return await response.json();
    },
    onSuccess: () => {
      setStep(4);
    },
    onError: (error: any) => {
      toast({
        title: "Gagal mengirim lamaran",
        description: error.message || "Terjadi kesalahan saat mengirim lamaran",
        variant: "destructive",
      });
    },
  });

  const handleStart = () => {
    checkCanApplyMutation.mutate();
  };

  const handleSubmit = () => {
    submitApplicationMutation.mutate();
  };

  const handleClose = () => {
    setStep(0);
    setCoverLetter("");
    setUserProfile(null);
    onClose();
  };

  const handleNextFromProfile = () => {
    setStep(2);
  };

  const handleNextFromCoverLetter = () => {
    setStep(3);
  };

  const handleViewApplications = () => {
    handleClose();
    window.location.hash = "applications";
  };

  if (checkCanApplyMutation.isPending) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
            <p className="text-gray-600">Memuat data profil...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {step === 1 && userProfile && (
          <>
            <DialogHeader>
              <DialogTitle data-testid="modal-title">Lamar ke {jobTitle || "Lowongan Ini"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Review Profil Anda</h3>
              
              <div className="space-y-3 bg-gray-50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Nama</p>
                    <p className="font-medium text-gray-900" data-testid="profile-name">{userProfile.name}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900" data-testid="profile-email">{userProfile.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Telepon</p>
                    <p className="font-medium text-gray-900" data-testid="profile-phone">{userProfile.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Resume</p>
                    <p className="font-medium text-gray-900" data-testid="profile-resume">{userProfile.resume}</p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600">Apakah informasi sudah benar?</p>

              <div className="flex gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    handleClose();
                    window.location.hash = "profile";
                  }}
                  className="flex-1"
                  data-testid="button-edit-profile"
                >
                  Edit Profil
                </Button>
                <Button
                  onClick={handleNextFromProfile}
                  className="flex-1 bg-primary text-black hover:bg-primary/90 font-bold"
                  data-testid="button-continue"
                >
                  Lanjutkan <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <DialogHeader>
              <DialogTitle data-testid="modal-title">Surat Lamaran (opsional)</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea
                placeholder="Tulis surat lamaran Anda di sini... (maksimal 500 karakter)"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value.slice(0, 500))}
                className="min-h-[150px]"
                data-testid="textarea-cover-letter"
              />
              <div className="text-right text-sm text-gray-500">
                {coverLetter.length}/500 karakter
              </div>

              <div className="flex gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                  data-testid="button-back"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
                </Button>
                <Button
                  onClick={handleNextFromCoverLetter}
                  className="flex-1 bg-primary text-black hover:bg-primary/90 font-bold"
                  data-testid="button-continue"
                >
                  Lanjutkan <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <DialogHeader>
              <DialogTitle data-testid="modal-title">Konfirmasi Lamaran</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-gray-700">Anda akan melamar ke:</p>
              
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">💼</span>
                  <span className="font-semibold text-gray-900" data-testid="confirm-job-title">{jobTitle}</span>
                </div>
                <div className="flex items-center gap-2 ml-9">
                  <span className="text-gray-600" data-testid="confirm-company">{companyName}</span>
                </div>
              </div>

              <p className="text-sm text-gray-600">Apakah Anda yakin?</p>

              <div className="flex gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                  data-testid="button-cancel"
                  disabled={submitApplicationMutation.isPending}
                >
                  Batal
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="flex-1 bg-primary text-black hover:bg-primary/90 font-bold"
                  disabled={submitApplicationMutation.isPending}
                  data-testid="button-submit"
                >
                  {submitApplicationMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Mengirim...
                    </>
                  ) : (
                    "Ya, Kirim Lamaran"
                  )}
                </Button>
              </div>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <div className="text-center py-6 space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2" data-testid="success-title">
                  Lamaran Berhasil Dikirim!
                </h2>
                <p className="text-gray-600">
                  Lamaran Anda telah dikirim ke <span className="font-semibold">{companyName}</span>
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-4 text-left">
                <p className="text-sm text-green-800">
                  Lacak status lamaran Anda di halaman <strong>Lamaran Saya</strong>
                </p>
              </div>

              <div className="flex gap-2 mt-6">
                <Button
                  onClick={handleViewApplications}
                  className="flex-1 bg-primary text-black hover:bg-primary/90 font-bold"
                  data-testid="button-view-applications"
                >
                  Lihat Lamaran Saya
                </Button>
                <Button
                  onClick={handleClose}
                  variant="outline"
                  className="flex-1"
                  data-testid="button-close"
                >
                  Tutup
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
