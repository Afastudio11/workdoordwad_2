import { useState } from "react";
import { Link } from "wouter";
import { Plus, Search, MoreVertical, Users, Eye, FileText } from "lucide-react";
import logoImgDark from "@assets/black@4x_1760695283292.png";
import { Button } from "@/components/ui/button";

interface Job {
  id: string;
  title: string;
  location: string;
  type: string;
  applicants: number;
  views: number;
  status: "active" | "closed" | "draft";
  postedDate: string;
}

export default function HiringPage() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "active" | "closed" | "draft">("all");

  const jobs: Job[] = [
    {
      id: "1",
      title: "Staff Admin",
      location: "Jakarta",
      type: "Full-time",
      applicants: 45,
      views: 320,
      status: "active",
      postedDate: "2 days ago",
    },
    {
      id: "2",
      title: "Kasir Toko",
      location: "Bandung",
      type: "Part-time",
      applicants: 23,
      views: 156,
      status: "active",
      postedDate: "5 days ago",
    },
    {
      id: "3",
      title: "Driver Pengiriman",
      location: "Surabaya",
      type: "Full-time",
      applicants: 67,
      views: 420,
      status: "closed",
      postedDate: "1 week ago",
    },
  ];

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchesTab = activeTab === "all" || job.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-gray-900 text-white";
      case "closed":
        return "bg-gray-100 text-gray-800";
      case "draft":
        return "bg-gray-300 text-gray-900";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center" data-testid="link-home">
              <img src={logoImgDark} alt="Pintu Kerja" className="h-8" />
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors" data-testid="link-findjob">
                Cari Pekerjaan
              </Link>
              <Link href="/messages" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors" data-testid="link-messages">
                Pesan
              </Link>
              <Link href="/hiring" className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors" data-testid="link-hiring">
                Rekrutmen
              </Link>
              <Link href="/community" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors" data-testid="link-community">
                Komunitas
              </Link>
              <Link href="/faq" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors" data-testid="link-faq">
                FAQ
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-semibold text-gray-900">Dashboard Rekrutmen</h1>
          <Button className="flex items-center gap-2" data-testid="button-post-job">
            <Plus className="h-4 w-4" />
            Posting Lowongan Baru
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Lowongan Aktif</h3>
              <FileText className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-3xl font-bold text-gray-900">12</p>
            <p className="text-sm text-gray-500 mt-1">+2 dari bulan lalu</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Pelamar</h3>
              <Users className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-3xl font-bold text-gray-900">135</p>
            <p className="text-sm text-gray-500 mt-1">+18 minggu ini</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Tampilan</h3>
              <Eye className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-3xl font-bold text-gray-900">896</p>
            <p className="text-sm text-gray-500 mt-1">+124 minggu ini</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari lowongan..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              data-testid="input-search-jobs"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === "all"
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
              data-testid="tab-all"
            >
              Semua Lowongan
            </button>
            <button
              onClick={() => setActiveTab("active")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === "active"
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
              data-testid="tab-active"
            >
              Aktif
            </button>
            <button
              onClick={() => setActiveTab("closed")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === "closed"
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
              data-testid="tab-closed"
            >
              Ditutup
            </button>
            <button
              onClick={() => setActiveTab("draft")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === "draft"
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
              data-testid="tab-draft"
            >
              Draft
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Judul Lowongan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lokasi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipe
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pelamar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tampilan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Diposting
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50" data-testid={`job-row-${job.id}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{job.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{job.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{job.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{job.applicants}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{job.views}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(job.status)}`}>
                        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{job.postedDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="text-gray-600 hover:text-gray-900" data-testid={`button-actions-${job.id}`}>
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No jobs found</p>
          </div>
        )}
      </div>
    </div>
  );
}
