export const TEST_USERS = {
  jobSeekers: {
    freshGraduate: {
      email: 'freshgrad.test@email.com',
      password: 'TestPassword123!',
      name: 'Budi Santoso',
      phone: '081234567890',
      role: 'job_seeker',
      bio: 'Fresh graduate dari Universitas Indonesia, jurusan Teknik Informatika dengan IPK 3.7',
      location: 'Jakarta',
      expectedSalary: 5000000,
      skills: ['JavaScript', 'React', 'Node.js', 'TypeScript'],
      education: 'S1 Teknik Informatika - Universitas Indonesia',
    },
    experiencedProfessional: {
      email: 'senior.test@email.com',
      password: 'TestPassword123!',
      name: 'Sarah Wijaya',
      phone: '081234567891',
      role: 'job_seeker',
      bio: 'Senior Software Engineer dengan 8 tahun pengalaman di berbagai startup dan korporasi',
      location: 'Bandung',
      expectedSalary: 25000000,
      skills: ['Python', 'Django', 'PostgreSQL', 'Docker', 'AWS', 'Microservices'],
      education: 'S1 Ilmu Komputer - ITB',
    },
    jobHopper: {
      email: 'jobhopper.test@email.com',
      password: 'TestPassword123!',
      name: 'Ahmad Prakoso',
      phone: '081234567892',
      role: 'job_seeker',
      bio: 'Mencari peluang karir baru',
      location: 'Surabaya',
      expectedSalary: 8000000,
      skills: ['HTML', 'CSS', 'PHP'],
      education: 'SMK Jurusan RPL',
    },
  },
  employers: {
    startup: {
      email: 'startup.hr@email.com',
      password: 'TestPassword123!',
      name: 'HR TechStart',
      phone: '081234567893',
      role: 'employer',
      companyName: 'TechStart Indonesia',
      companyDescription: 'Startup teknologi yang fokus pada solusi AI dan Machine Learning',
      companyWebsite: 'https://techstart.id',
      companySize: '10-50',
      industry: 'Technology',
      location: 'Jakarta Selatan',
    },
    corporate: {
      email: 'corporate.hr@email.com',
      password: 'TestPassword123!',
      name: 'HR PT Maju Bersama',
      phone: '081234567894',
      role: 'employer',
      companyName: 'PT Maju Bersama',
      companyDescription: 'Perusahaan multinasional dengan lebih dari 500 karyawan di seluruh Indonesia',
      companyWebsite: 'https://majubersama.co.id',
      companySize: '500+',
      industry: 'Finance',
      location: 'Jakarta Pusat',
    },
    sme: {
      email: 'sme.owner@email.com',
      password: 'TestPassword123!',
      name: 'Owner CV Usaha Mandiri',
      phone: '081234567895',
      role: 'employer',
      companyName: 'CV Usaha Mandiri',
      companyDescription: 'Usaha kecil menengah di bidang perdagangan dan retail',
      companyWebsite: 'https://usahamandiri.com',
      companySize: '1-10',
      industry: 'Retail',
      location: 'Semarang',
    },
  },
};

export const TEST_JOBS = {
  softwareDeveloper: {
    title: 'Software Developer',
    description: 'Kami mencari software developer yang passionate dalam teknologi web modern',
    requirements: 'Min. 1 tahun pengalaman, menguasai JavaScript, React, Node.js',
    location: 'Jakarta',
    type: 'full_time',
    salary: 8000000,
    maxSalary: 12000000,
    category: 'Technology',
  },
  uiuxDesigner: {
    title: 'UI/UX Designer',
    description: 'Bergabunglah dengan tim kreatif kami untuk menciptakan pengalaman pengguna yang luar biasa',
    requirements: 'Portfolio yang kuat, menguasai Figma, Adobe XD',
    location: 'Jakarta',
    type: 'full_time',
    salary: 7000000,
    maxSalary: 10000000,
    category: 'Design',
  },
  marketingManager: {
    title: 'Marketing Manager',
    description: 'Pimpin strategi marketing kami untuk pertumbuhan yang eksponensial',
    requirements: 'Min. 3 tahun pengalaman di digital marketing, leadership skills',
    location: 'Jakarta',
    type: 'full_time',
    salary: 12000000,
    maxSalary: 18000000,
    category: 'Marketing',
  },
  dataAnalyst: {
    title: 'Data Analyst',
    description: 'Analisis data untuk mendukung keputusan bisnis strategis',
    requirements: 'SQL, Python, data visualization tools',
    location: 'Bandung',
    type: 'contract',
    salary: 9000000,
    maxSalary: 13000000,
    category: 'Data',
  },
  accountant: {
    title: 'Senior Accountant',
    description: 'Kelola keuangan perusahaan dengan akurasi tinggi',
    requirements: 'S1 Akuntansi, bersertifikat, min. 5 tahun pengalaman',
    location: 'Jakarta',
    type: 'full_time',
    salary: 10000000,
    maxSalary: 15000000,
    category: 'Finance',
  },
};

export const COVER_LETTERS = {
  enthusiastic: `Kepada Yth. HRD,

Saya sangat tertarik dengan posisi ini dan yakin dapat memberikan kontribusi positif untuk perusahaan. Dengan latar belakang dan pengalaman saya, saya siap menghadapi tantangan baru.

Terima kasih atas pertimbangannya.

Hormat saya,`,
  
  professional: `Kepada Yth. Tim Rekrutmen,

Saya mengajukan lamaran untuk posisi yang Anda iklankan. Dengan pengalaman saya di bidang terkait dan kemampuan yang saya miliki, saya yakin dapat memberikan nilai tambah bagi tim Anda.

Saya sangat menantikan kesempatan untuk berdiskusi lebih lanjut.

Salam hormat,`,
  
  brief: `Dengan ini saya melamar untuk posisi yang tersedia. Terlampir CV saya untuk pertimbangan.

Terima kasih.`,
};
