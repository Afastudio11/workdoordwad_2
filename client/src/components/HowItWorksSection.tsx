import starburstImg from "@assets/0d231d(1)_1760687086089.png";

const steps = [
  {
    number: "1",
    title: "Create Accounts",
    description: "Depending on the delivery option you selected at checkout, we'll email you a tracking link after your order has been shipped. Enterprise resource planning (ERP) is a single platform. We've spent over a decade refining Todoist to be an extension of your organize tasks instantly using easy-flowing."
  },
  {
    number: "2",
    title: "Complete Your Profile",
    description: ""
  },
  {
    number: "3",
    title: "Apply Job Or Hire",
    description: ""
  }
];

const stats = [
  {
    value: "45k+",
    description: "Innovative design tools can thrust your business ahead by engaging new customers across new platforms."
  },
  {
    value: "15min+",
    description: "Creative design tools can drive your business ahead by drawing in new customers through unique platforms."
  },
  {
    value: "2000+",
    description: "Revolutionary design instruments can propel your venture forward by captivating fresh on novel mediums."
  }
];

export default function HowItWorksSection() {
  return (
    <section className="relative py-24 bg-gray-50 dark:bg-gray-100 overflow-hidden">
      {/* Decorative starburst */}
      <div className="absolute bottom-32 left-8 w-24 h-24 opacity-60">
        <img src={starburstImg} alt="" className="w-full h-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Left Side - Steps */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6" data-testid="how-it-works-title">
              Get things Done with<br />Minimal Effort
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed" data-testid="how-it-works-description">
              Depending on the delivery option you selected at checkout, we'll email you a tracking link after your order has been shipped.
            </p>

            <div className="space-y-6">
              {steps.map((step, index) => (
                <div key={index} className="flex gap-4" data-testid={`step-${index}`}>
                  <div className="flex-shrink-0">
                    <span className="text-xl font-bold text-black">{step.number}.</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-black mb-2" data-testid={`step-title-${index}`}>
                      {step.title}
                    </h4>
                    {step.description && (
                      <p className="text-gray-600 text-sm leading-relaxed" data-testid={`step-description-${index}`}>
                        {step.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Image Card */}
          <div className="flex items-center justify-center">
            <div className="relative bg-gray-800 rounded-3xl p-8 max-w-md transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <div className="absolute top-4 right-4 bg-white rounded-full p-2">
                <svg className="w-8 h-8" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </div>
              
              <div className="bg-gray-700 rounded-2xl p-6 mb-6 h-48 flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">Nerd in Job Opening</h3>
                  <p className="text-gray-400">Professional Meeting</p>
                </div>
              </div>
              
              <div className="text-white mb-4">
                <p className="text-lg mb-1">
                  Made for professionals <span className="text-primary font-semibold">Change your website</span>
                </p>
                <p className="text-lg">into a true sector leader.</p>
              </div>
              
              <button className="w-full bg-primary text-black font-semibold py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors" data-testid="button-upload-resume">
                Uploaded Resume
              </button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center md:text-left" data-testid={`stat-${index}`}>
              <h3 className="text-4xl md:text-5xl font-bold text-black mb-4" data-testid={`stat-value-${index}`}>
                {stat.value}
              </h3>
              <p className="text-gray-600 leading-relaxed" data-testid={`stat-description-${index}`}>
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
