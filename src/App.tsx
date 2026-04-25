import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Github, 
  Linkedin, 
  Mail, 
  ArrowRight,
  FileText,
  Briefcase,
  Video,
  Youtube,
  GraduationCap,
  Globe,
  BarChart3,
  Infinity,
  Cloud,
  PenTool,
  Share2,
  Sparkles,
  Clapperboard,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';

const GlassContainer = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`backdrop-blur-md md:backdrop-blur-[40px] bg-white/5 border border-white/10 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] will-change-[backdrop-filter] ${className}`}>
    {children}
  </div>
);

interface TimelineItemProps {
  title: string;
  company: string;
  dates: string;
  description: string;
  tags: string[];
  icon: any;
  isLast: boolean;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ title, company, dates, description, tags, icon: Icon, isLast }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="relative pl-8 md:pl-12 pb-16">
      {/* Vertical Line */}
      {!isLast && <div className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-white/10" />}
      
      {/* Node */}
      <div className="absolute left-0 top-2 w-10 h-10 rounded-full bg-charcoal border-2 border-indigo-500/50 flex items-center justify-center z-10 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
        <div className="w-2 h-2 rounded-full bg-indigo-500" />
      </div>

      <motion.div
        initial={isMobile ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
        animate={isMobile ? { opacity: 1, x: 0 } : undefined}
        whileInView={isMobile ? undefined : { opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: isMobile ? 0 : 0.5 }}
      >
        <GlassContainer className="p-6 md:p-8 group hover:bg-white/10 transition-all duration-500">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
              <Icon className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold tracking-tighter text-white">{title}</h3>
              <p className="text-indigo-400 font-medium">{company}</p>
            </div>
          </div>
          <div className="text-[10px] uppercase tracking-widest font-bold text-white/40 bg-white/5 px-3 py-1 rounded-full border border-white/10 self-start">
            {dates}
          </div>
        </div>
        
        <p className="text-white/60 mb-8 leading-relaxed">
          {description}
        </p>

        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <span key={tag} className="text-[10px] uppercase tracking-widest font-semibold text-white/40 border border-white/10 px-3 py-1.5 rounded-full hover:bg-white/5 transition-colors">
              {tag}
            </span>
          ))}
        </div>
      </GlassContainer>
      </motion.div>
    </div>
  );
};

const RippleButton = ({ children, className = "", onClick, type = "button" }: { children: React.ReactNode, className?: string, onClick?: () => void, type?: "button" | "submit" }) => {
  const [ripples, setRipples] = useState<{ x: number, y: number, id: number }[]>([]);

  const addRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples(prev => [...prev, { x, y, id }]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id));
    }, 1000);
    if (onClick) onClick();
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={addRipple}
      type={type}
      className={`relative overflow-hidden transition-all duration-300 ${className}`}
    >
      {children}
      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.span
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{
              position: 'absolute',
              left: ripple.x,
              top: ripple.y,
              width: '20px',
              height: '20px',
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none'
            }}
          />
        ))}
      </AnimatePresence>
    </motion.button>
  );
};

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('CAMERON');
  const [isMobile, setIsMobile] = useState(false);
  const [formStatus, setFormStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('LOADING');
    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch('https://formspree.io/f/xdkgnrjq', {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });
      
      if (response.ok) {
        setFormStatus('SUCCESS');
        (e.target as HTMLFormElement).reset();
        setTimeout(() => setFormStatus('IDLE'), 5000);
      } else {
        setFormStatus('ERROR');
      }
    } catch (error) {
      setFormStatus('ERROR');
    }
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const sections = ['about', 'work', 'contact'];
    
    const handleScroll = () => {
      if (window.scrollY < 50) {
        setActiveSection('CAMERON');
      }
    };

    const observerOptions = {
      root: null,
      rootMargin: '-40% 0px -40% 0px',
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      if (window.scrollY >= 50) {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id.toUpperCase());
          }
        });
      }
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const workExperience = [
    {
      title: "Independent Marketing Consultant",
      company: "Freelance",
      dates: "Jan 2026 – Present",
      description: "Directed organic growth strategy for financial services, pivoting to high-performing video content. Achieved a 4,600% surge in non-follower interactions and 171% increase in engagement within 30 days.",
      tags: ["Digital Strategy", "Content Optimization", "Instagram", "Facebook", "Analytics"],
      icon: Briefcase
    },
    {
      title: "Digital Content Specialist / Assistant",
      company: "Visit Ventura",
      dates: "April 2024 – March 2025",
      description: "Managed high-volume content creation and multi-channel scheduling while overseeing the Simpleview CRM database. Streamlined digital asset workflows and Mailchimp automation to drive engagement and operational efficiency.",
      tags: ["CRM", "Mailchimp", "WordPress", "SEO", "Adobe", "Content Scheduling"],
      icon: Video
    },
    {
      title: "Founder & Content Strategist",
      company: "Leafy Radio (YouTube)",
      dates: "2016 – Present",
      description: "Engineered a data-driven content engine that scaled a music-discovery platform to 360k+ subscribers. Managed the full technical lifecycle of video production and cross-channel promotional systems.",
      tags: ["YouTube SEO", "Final Cut Pro", "Video Editing", "Content Strategy", "Analytics"],
      icon: Youtube
    },
    {
      title: "Education",
      company: "CSUCI & Ventura College",
      dates: "Graduated 2023 (BS) | 2020 (AS)",
      description: "BS in Business Marketing from CSU Channel Islands and AS in Mathematics from Ventura College. Focused on the intersection of quantitative data analysis and strategic marketing.",
      tags: ["Data Analysis", "Marketing Strategy", "Mathematics"],
      icon: GraduationCap
    }
  ];

  const martechLogos = [
    { name: 'WordPress', icon: Globe },
    { name: 'Google Analytics', icon: BarChart3 },
    { name: 'Mailchimp', icon: Mail },
    { name: 'Social Media', icon: Share2 },
    { name: 'Meta', icon: Infinity },
    { name: 'Simpleview CRM', icon: Cloud },
    { name: 'Adobe CC', icon: PenTool },
    { name: 'Prompt Engineering', icon: Sparkles },
    { name: 'Final Cut Pro', icon: Clapperboard },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden selection:bg-indigo-500/30">
      {/* Background (Static Gradient Blobs - Resource Efficient) */}
      <div 
        className="fixed inset-0 -z-10 bg-charcoal"
        style={{
          backgroundImage: `
            radial-gradient(circle at 10% 10%, rgba(79, 70, 229, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 90% 90%, rgba(225, 29, 72, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(5, 150, 105, 0.1) 0%, transparent 40%)
          `
        }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl px-6 py-4 flex justify-between items-center shadow-lg">
            <motion.div 
              initial={isMobile ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xl font-bold tracking-tighter z-50 h-6 overflow-hidden flex items-center"
            >
              <AnimatePresence mode="wait">
                <motion.a
                  key={activeSection}
                  href="#"
                  onClick={() => setIsMenuOpen(false)}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="block"
                >
                  {activeSection}<span className="text-indigo-500">.</span>
                </motion.a>
              </AnimatePresence>
            </motion.div>

            {/* Desktop Menu */}
            <motion.div 
              initial={isMobile ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden md:flex gap-8"
            >
              <a href="#about" className="text-[10px] uppercase tracking-widest font-semibold text-white/60 hover:text-white transition-colors">About</a>
              <a href="#work" className="text-[10px] uppercase tracking-widest font-semibold text-white/60 hover:text-white transition-colors">Work</a>
              <a href="#contact" className="text-[10px] uppercase tracking-widest font-semibold text-white/60 hover:text-white transition-colors">Contact</a>
            </motion.div>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden z-50 w-8 h-8 flex flex-col justify-center items-center gap-1.5 focus:outline-none"
            >
              <motion.span 
                animate={isMenuOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
                className="w-6 h-0.5 bg-white block rounded-full origin-center"
              />
              <motion.span 
                animate={isMenuOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
                className="w-6 h-0.5 bg-white block rounded-full origin-center"
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 backdrop-blur-3xl bg-charcoal/80 flex flex-col items-center justify-center p-6"
          >
            <div className="flex flex-col items-center gap-12">
              <a 
                href="#about" 
                onClick={() => setIsMenuOpen(false)}
                className="text-4xl font-bold tracking-tighter hover:text-indigo-400 transition-colors"
              >
                About
              </a>
              <a 
                href="#work" 
                onClick={() => setIsMenuOpen(false)}
                className="text-4xl font-bold tracking-tighter hover:text-indigo-400 transition-colors"
              >
                Work
              </a>
              <a 
                href="#contact" 
                onClick={() => setIsMenuOpen(false)}
                className="text-4xl font-bold tracking-tighter hover:text-indigo-400 transition-colors"
              >
                Contact
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10 pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <section id="hero" className="min-h-[85svh] flex flex-col justify-center pb-32 md:pb-0 mb-12 md:mb-16 scroll-mt-32">
            <div className="max-w-4xl">
              <span className="text-[12px] uppercase tracking-[0.3em] font-bold text-indigo-400 mb-6 block">
                Hello, My name is
              </span>
              <h1 className="text-6xl md:text-9xl font-extrabold tracking-tighter mb-8 leading-[0.9]">
                Cameron <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-rose-400 to-emerald-400">Yzaguirre</span>
              </h1>
              <p className="text-2xl md:text-3xl text-white/80 max-w-3xl mb-12 font-light tracking-tight">
                Marketing Operations Specialist
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#contact">
                  <RippleButton className="px-8 py-4 bg-indigo-500/20 border border-indigo-500/30 rounded-2xl font-semibold hover:bg-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                    Let's Talk
                  </RippleButton>
                </a>
                <a href="#work">
                  <RippleButton className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-semibold hover:bg-white/10">
                    View My Work
                  </RippleButton>
                </a>
              </div>
            </div>
          </section>

          {/* About Section */}
          <section id="about" className="mb-32 md:mb-48 scroll-mt-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-16 items-center">
              {/* Mobile Header */}
              <h2 className="lg:hidden text-4xl font-bold tracking-tighter">About Me</h2>

              <motion.div
                initial={isMobile ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                animate={isMobile ? { opacity: 1, x: 0 } : undefined}
                whileInView={isMobile ? undefined : { opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: isMobile ? 0 : 0.8 }}
                className="order-2 lg:order-1"
              >
                {/* Desktop Header */}
                <h2 className="hidden lg:block text-4xl md:text-5xl font-bold tracking-tighter mb-8">About Me</h2>
                <div className="space-y-6 text-white/70 leading-relaxed text-lg">
                  <p className="italic text-white/40">
                    "I bet he used a template for this site..."
                  </p>
                  <p>
                    Actually, I built this using <span className="font-bold text-white">Google AI Studio</span>, managed version control with <span className="font-bold text-white">GitHub</span>, and deployed through <span className="font-bold text-white">Vercel</span>. Understanding the systems and logic behind the operations is my approach to Marketing. I want to build the <span className="font-bold text-white">infrastructure</span> that makes marketing work.
                  </p>
                  <p>
                    My professional career started at <a href="https://visitventuraca.com/" target="_blank" rel="noopener noreferrer" className="font-bold text-white hover:text-indigo-400 underline underline-offset-4 decoration-white/20 hover:decoration-indigo-400/50 transition-all">Visit Ventura</a>. Within <span className="font-bold text-white">10 months</span>, I was promoted from an assistant role to <span className="font-bold text-white">Content Specialist</span>. Throughout my time there, I managed the lifecycle of <span className="font-bold text-white">digital initiatives</span>—ranging from <span className="font-bold text-white">paid ad management</span> and multimedia production to <span className="font-bold text-white">technical website maintenance</span>—with my level of ownership and responsibility increasing significantly as I moved into my specialist role.
                  </p>
                  <p>
                    Before that, I built <a href="https://www.youtube.com/@Leafyradio" target="_blank" rel="noopener noreferrer" className="font-bold text-white hover:text-indigo-400 underline underline-offset-4 decoration-white/20 hover:decoration-indigo-400/50 transition-all">Leafy Radio</a> from the ground up. Scaling an independent platform to <span className="font-bold text-white">360k subscribers</span> taught me that the best creative decisions are usually driven by <span className="font-bold text-white">audience data</span>.
                  </p>
                  <div className="pt-4 border-t border-white/5">
                    <p className="font-bold text-white mb-2">What I’m looking for next:</p>
                    <p>
                      I’m looking to grow into the technical side of <span className="font-bold text-white">marketing and content operations</span> without limiting my potential. I want to solve creative and technical challenges within a culture that prioritizes professional respect and efficient, sustainable processes.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={isMobile ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                animate={isMobile ? { opacity: 1, scale: 1 } : undefined}
                whileInView={isMobile ? undefined : { opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: isMobile ? 0 : 0.8 }}
                className="relative order-1 lg:order-2 w-full"
              >
                <GlassContainer className="aspect-square relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-rose-500/10" />
                  <div className="absolute inset-3 z-10 rounded-2xl overflow-hidden border border-white/10">
                    <img 
                      src="./portrait.webp" 
                      alt="Cameron Yzaguirre - Marketing Operations Specialist" 
                      className="w-full h-full object-cover opacity-70 grayscale hover:grayscale-0 transition-all duration-500"
                      referrerPolicy="no-referrer"
                      loading="eager"
                      fetchPriority="high"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src.includes('./portrait.webp')) {
                          target.src = '/portrait.webp';
                        }
                      }}
                    />
                  </div>
                </GlassContainer>
              </motion.div>
            </div>
          </section>

          {/* Martech Logo Grid */}
          <section className="mb-16 md:mb-24 relative">
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 md:gap-x-20 py-4">
              {martechLogos.map((logo) => (
                <div 
                  key={logo.name}
                  className="flex items-center gap-3 opacity-30 hover:opacity-100 transition-all duration-300 grayscale hover:grayscale-0 cursor-default group"
                >
                  <logo.icon className="w-6 h-6 md:w-8 md:h-8 text-white group-hover:text-indigo-400 transition-colors" />
                  <span className="text-[10px] md:text-[12px] uppercase tracking-[0.2em] font-bold text-white whitespace-nowrap">
                    {logo.name}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Work Section */}
          <section id="work" className="mb-48 scroll-mt-32">
            <div className="mb-16">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">Work</h2>
            </div>
            <div className="max-w-4xl">
              {workExperience.map((exp, index) => (
                <TimelineItem 
                  key={index}
                  title={exp.title}
                  company={exp.company}
                  dates={exp.dates}
                  description={exp.description}
                  tags={exp.tags}
                  icon={exp.icon}
                  isLast={index === workExperience.length - 1}
                />
              ))}
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="mb-20 scroll-mt-32">
            <GlassContainer className="p-12 md:p-24 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-rose-500 to-emerald-500 opacity-50" />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-4 block">Get in touch</span>
                  <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8 leading-tight">Excited to know more?<br /><span className="text-indigo-400">Let's talk!</span></h2>
                  <p className="text-white/60 mb-12 text-lg">Currently open to new opportunities and connections. Feel free to reach out for collaborations or just a friendly chat.</p>
                  
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 text-white/80">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                        <Mail className="w-5 h-5 text-indigo-400" />
                      </div>
                      <span>cameron.yzaguirre@gmail.com</span>
                    </div>
                    <div className="flex items-center gap-4 text-white/80">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                        <Linkedin className="w-5 h-5 text-indigo-400" />
                      </div>
                      <span>linkedin.com/in/cameron-yzaguirre</span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 ml-2">Name</label>
                      <input name="name" required type="text" placeholder="John Doe" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-indigo-500/50 transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 ml-2">Email</label>
                      <input name="email" required type="email" placeholder="john@example.com" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-indigo-500/50 transition-colors" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-white/40 ml-2">Message</label>
                    <textarea name="message" required rows={4} placeholder="Tell me about your project..." className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-indigo-500/50 transition-colors resize-none" />
                  </div>
                  <RippleButton 
                    type="submit" 
                    className={`w-full py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                      formStatus === 'SUCCESS' ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' :
                      formStatus === 'ERROR' ? 'bg-rose-500/20 border-rose-500/30 text-rose-400' :
                      'bg-indigo-500/20 border-indigo-500/30 hover:bg-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.2)]'
                    }`}
                  >
                    {formStatus === 'LOADING' && <Loader2 className="w-5 h-5 animate-spin" />}
                    {formStatus === 'SUCCESS' && <CheckCircle2 className="w-5 h-5" />}
                    {formStatus === 'ERROR' && <AlertCircle className="w-5 h-5" />}
                    {formStatus === 'IDLE' && 'Send Message'}
                    {formStatus === 'LOADING' && 'Sending...'}
                    {formStatus === 'SUCCESS' && 'Message Sent!'}
                    {formStatus === 'ERROR' && 'Something went wrong'}
                  </RippleButton>
                </form>
              </div>

              <div className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                <p className="text-[10px] uppercase tracking-widest font-bold text-white/20">© 2026 CAMERON YZAGUIRRE. ALL RIGHTS RESERVED.</p>
                <div className="flex gap-8">
                  <a href="#" className="text-[10px] uppercase tracking-widest font-bold text-white/20 hover:text-white/40 transition-colors">Privacy</a>
                  <a href="#" className="text-[10px] uppercase tracking-widest font-bold text-white/20 hover:text-white/40 transition-colors">Terms</a>
                </div>
              </div>
            </GlassContainer>
          </section>
        </div>
      </main>
    </div>
  );
}

