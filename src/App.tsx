import { useState, useEffect, useRef } from 'react';
import { Menu, X, Code, Briefcase, User, Mail, Github, Linkedin, ChevronDown, Shield, Download, Award, TrendingUp, Users, CheckCircle, Send, Moon, Sun, ArrowUp, Printer, AlertCircle, ExternalLink } from 'lucide-react';

// Project Content Component
function ProjectContent({ project, darkMode }: { project: any; darkMode: boolean }) {
  return (
    <>
      <div className="text-4xl md:text-5xl mb-4">{project.icon}</div>
      <h3 className="text-xl md:text-2xl font-bold mb-3 text-red-600">{project.title}</h3>
      <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-4 text-sm md:text-base`}>{project.description}</p>
      <div className={`${darkMode ? 'bg-yellow-900/30 border-yellow-600' : 'bg-yellow-50 border-yellow-500'} border-l-4 p-3 mb-4`}>
        <p className={`text-sm font-semibold ${darkMode ? 'text-yellow-400' : 'text-yellow-800'}`}>📈 {project.impact}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {project.tags.map((tag: string, i: number) => (
          <span
            key={i}
            className={`px-2 md:px-3 py-1 ${darkMode ? 'bg-blue-900/50 text-blue-300 border-blue-700' : 'bg-blue-50 text-blue-700 border-blue-200'} rounded-full text-xs md:text-sm border`}
          >
            {tag}
          </span>
        ))}
      </div>
      {project.link && (
        <div className="flex items-center gap-2 text-red-600 text-sm font-semibold mt-3">
          <ExternalLink size={16} />
          <span>Visit Website</span>
        </div>
      )}
    </>
  );
}

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState('');
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [formErrorMessage, setFormErrorMessage] = useState<string>('');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const [counters, setCounters] = useState({ years: 0, projects: 0, performance: 0, satisfaction: 0 });
  const [visibleSections, setVisibleSections] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    // Loading animation
    setTimeout(() => setIsLoading(false), 1000);

    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
      setShowBackToTop(window.scrollY > 500);
      
      if (statsRef.current) {
        const rect = statsRef.current.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
        if (isVisible && !statsVisible) {
          setStatsVisible(true);
          animateCounters();
        }
      }

      // Animate sections on scroll
      const sections = ['about', 'experience', 'skills', 'projects', 'testimonials', 'services', 'contact'];
      sections.forEach((sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          const isVisible = rect.top < window.innerHeight - 100;
          if (isVisible && !visibleSections[sectionId]) {
            setVisibleSections(prev => ({ ...prev, [sectionId]: true }));
          }
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state
    return () => window.removeEventListener('scroll', handleScroll);
  }, [statsVisible, visibleSections]);

  const animateCounters = () => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      
      setCounters({
        years: Math.floor(5 * progress),
        projects: Math.floor(6 * progress),
        performance: Math.floor(20 * progress),
        satisfaction: Math.floor(100 * progress)
      });
      
      if (step >= steps) clearInterval(timer);
    }, interval);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setMobileMenuOpen(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setFormStatus('sending');
    setFormErrorMessage('');

    const form = e.currentTarget;
    const formDataToSubmit = new FormData(form);

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formDataToSubmit as any).toString(),
      });

      // Handle different HTTP status codes
      if (response.ok) {
        setFormStatus('success');
        setFormData({ name: '', email: '', message: '' });
        setFormErrors({});
        setFormErrorMessage('');
        setTimeout(() => setFormStatus(''), 5000);
      } else {
        // Map status codes to user-friendly messages
        let errorMessage = 'Something went wrong. Please try again or email me directly.';
        
        switch (response.status) {
          case 400:
            errorMessage = 'Invalid form data. Please check your information and try again.';
            break;
          case 403:
            errorMessage = 'Access forbidden. Please try refreshing the page.';
            break;
          case 404:
            errorMessage = 'Form endpoint not found. Please contact me via email.';
            break;
          case 429:
            errorMessage = 'Too many attempts. Please wait a moment and try again.';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later or email me directly.';
            break;
          case 502:
            errorMessage = 'Bad gateway. Please try again in a few moments.';
            break;
          case 503:
            errorMessage = 'Service temporarily unavailable. Please try again later.';
            break;
          default:
            if (response.status >= 500) {
              errorMessage = 'Server error. Please try again later.';
            } else if (response.status >= 400) {
              errorMessage = 'Request failed. Please check your information and try again.';
            }
        }

        console.error(`Form submission failed with status: ${response.status}`);
        setFormStatus('error');
        setFormErrorMessage(errorMessage);
        setTimeout(() => setFormStatus(''), 8000);
      }
    } catch (error) {
      // Handle network errors and exceptions
      let errorMessage = 'Network error. Please check your connection and try again.';
      
      if (error instanceof TypeError) {
        if (error.message.includes('fetch')) {
          errorMessage = 'Unable to connect to server. Please check your internet connection.';
        } else if (error.message.includes('network')) {
          errorMessage = 'Network error. Please check your connection.';
        }
      } else if (error instanceof Error) {
        errorMessage = `Error: ${error.message}`;
      }

      console.error('Form submission error:', error);
      setFormStatus('error');
      setFormErrorMessage(errorMessage);
      setTimeout(() => setFormStatus(''), 8000);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };

  const navLinks = [
    { name: 'About', id: 'about' },
    { name: 'Experience', id: 'experience' },
    { name: 'Skills', id: 'skills' },
    { name: 'Projects', id: 'projects' },
    { name: 'Services', id: 'services' },
    { name: 'Contact', id: 'contact' }
  ];

  const stats = [
    { number: counters.years, label: 'Years Experience', icon: <TrendingUp size={24} />, suffix: '+' },
    { number: counters.projects, label: 'Major Projects', icon: <Briefcase size={24} />, suffix: '' },
    { number: counters.performance, label: 'Performance Boost', icon: <Award size={24} />, suffix: '%' },
    { number: counters.satisfaction, label: 'Client Satisfaction', icon: <Users size={24} />, suffix: '%' }
  ];

  const skills = [
    { name: 'IT Management', icon: '💼', category: 'Management', level: 95 },
    { name: 'Data Analysis', icon: '📊', category: 'Analysis', level: 90 },
    { name: 'Power BI', icon: '📈', category: 'Analysis', level: 85 },
    { name: 'SQL', icon: '🗄️', category: 'Analysis', level: 88 },
    { name: 'HTML/CSS/JavaScript', icon: '🌐', category: 'Development', level: 82 },
    { name: 'Git', icon: '📦', category: 'Development', level: 80 },
    { name: 'Network Administration', icon: '🔧', category: 'Infrastructure', level: 92 },
    { name: 'IT Security', icon: '🔒', category: 'Security', level: 90 },
    { name: 'ITIL Framework', icon: '📋', category: 'Management', level: 88 },
    { name: 'Server Virtualization', icon: '☁️', category: 'Infrastructure', level: 85 },
    { name: 'Data Protection', icon: '🛡️', category: 'Security', level: 93 },
    { name: 'Project Management', icon: '📅', category: 'Management', level: 90 }
  ];

  const experiences = [
    {
      title: 'Technology Application Support Manager',
      company: 'Alphamead Group',
      location: 'Lagos, Nigeria',
      period: 'December 2025 – Present',
      achievements: [
        'Oversaw full lifecycle management of business-critical applications, including deployment, configuration, patching, and version control, ensuring optimal performance and reliability',
        'Managed seamless integration of applications with existing IT infrastructure and third-party systems, enhancing operational efficiency and user experience',
        'Led the design, implementation, and mentoring of application support teams, establishing SLAs, escalation procedures, and incident management protocols to ensure timely resolution of issues and continuous improvement of support processes',
        'Acted as primary liaison between IT and business units, translating business requirements into technical solutions and ensuring alignment of application support with organizational goals and objectives',       
        'Implemented proactive monitoring and performance tuning strategies to optimize application performance, reduce downtime, and enhance user satisfaction',
        'Driven continuous improvement initiatives for application support processes, leveraging industry best practices and emerging technologies to enhance service delivery and operational efficiency',
        'Collaborated with cross-functional teams to plan and execute application upgrades, migrations, and new deployments, ensuring minimal disruption to business operations and seamless transition to new technologies'
      ]
    },
    {
      title: 'IT Manager & Data Protection Officer',
      company: 'Brent Mortgage Bank Limited',
      location: 'Lagos, Nigeria',
      period: 'October 2021 – August 2025',
      achievements: [
        'Spearheaded the implementation of a new mobile banking app with Interswitch, NIBSS, and NIP, achieving a 15% increase in customer transactions and 10% improvement in satisfaction ratings within the first year',
        'Optimized IT infrastructure through server virtualization and network enhancements, resulting in 20% increase in system performance and 5% reduction in downtime over the course of two years',
        'Enhanced network security by configuring and maintaining servers, routers, and switches, minimizing security breaches and ensuring data confidentiality and integrity',
        'Developed and enforced IT policies in compliance with banking regulations, ensuring data protection and risk mitigation over the course of two years',
        'Managed IT vendor performance to ensure cost-effectiveness and high-quality service delivery over the course of two years',
        'Provided technical support and training to staff, improving IT literacy and reducing support tickets by 15% over two years',
        'Collaborated with cross-functional teams to align IT initiatives with business goals, driving digital transformation and operational efficiency across the organization over the course of two years',
        'Implemented a new data protection policy, resulting in a 20% reduction in data breaches and 10% increase in data security over the course of two years',
        'Implemented a new ITIL framework, resulting in a 15% reduction in incidents and 5% increase in customer satisfaction over the course of two years',
        'Led the successful migration of critical applications to a new cloud platform, improving scalability and reducing infrastructure costs by 25% over the course of two years'
      ]
    },
    {
      title: 'Junior Data Analyst',
      company: 'Infonomics Technology Services',
      location: 'Lagos, Nigeria',
      period: 'September 2020 – October 2021',
      achievements: [
        'Collected and analyzed data from diverse sources, identifying key trends to support business decision-making and strategy development',
        'Created compelling data visualizations using Power BI and Excel to communicate insights to stakeholders and drive strategic decision-making',
        'Utilized SQL queries to extract and manipulate data, ensuring accuracy and integrity of the dataset',
        'Collaborated with cross-functional teams to develop and implement data-driven solutions, ensuring alignment with organizational objectives and business requirements',
        'Provided support to other analysts and stakeholders, ensuring data quality and accuracy, and ensuring compliance with data protection regulations',
        'Participated in code reviews and provided constructive feedback to fellow developers, fostering a collaborative and efficient development process',
        'Maintained and updated existing data models and dashboards, implementing new features and fixing bugs to ensure optimal performance and user satisfaction',
        'Conducted training sessions for staff on data analysis tools and techniques, improving data literacy and empowering teams to leverage data for decision-making'
      ]
    },
    {
      title: 'Frontend Web Developer',
      company: 'Ceflix Scepter',
      location: 'Lagos, Nigeria',
      period: 'July 2018 – November 2019',
      achievements: [
        'Developed user-friendly web applications using HTML, CSS, and JavaScript to enhance user experience and functionality',
        'Implemented responsive design principles for optimal functionality across devices and screen sizes',
        'Translated UI designs from Adobe XD into functional web interfaces using HTML, CSS, and JavaScript, ensuring pixel-perfect implementation and seamless user experience',
        'Optimized website performance using GT Metrix, improving page load speed and user engagement',
        'Collaborated with backend developers to integrate APIs and ensure seamless data flow between frontend and backend systems, enhancing overall application functionality and user experience',
        'Maintained and updated existing web applications, implementing new features and fixing bugs to ensure optimal performance and user satisfaction',
        'Participated in code reviews and provided constructive feedback to fellow developers, fostering a collaborative and efficient development process'
      ]
    }
  ];

  const allProjects = [
    {
      title: 'Mobile Banking Implementation',
      description: 'Led cross-functional team to deploy mobile banking solution integrated with national payment infrastructure, serving thousands of customers.',
      tags: ['Project Management', 'Mobile Banking', 'Integration', 'Fintech'],
      icon: '📱',
      impact: '15% increase in transactions',
      category: 'Management'
    },
    {
      title: 'IT Infrastructure Optimization',
      description: 'Redesigned and virtualized server infrastructure, improving system performance by 20% while reducing operational costs.',
      tags: ['Virtualization', 'Network Engineering', 'Performance Optimization'],
      icon: '⚙️',
      impact: '20% performance boost',
      category: 'Infrastructure'
    },
    {
      title: 'Data Compliance Framework',
      description: 'Developed comprehensive data protection policies and procedures ensuring regulatory compliance with banking standards.',
      tags: ['Data Protection', 'Compliance', 'Risk Management', 'Policy Development'],
      icon: '🛡️',
      impact: '100% compliance achieved',
      category: 'Security'
    },
    {
      title: 'Twinkle Trading & Consult',
      description: 'Professional business website for trading and consulting services with modern responsive design and contact functionality.',
      tags: ['Web Development', 'React', 'Business Website', 'Responsive Design'],
      icon: '💼',
      impact: 'Live at twinkletradingconsult.com',
      category: 'Web Development',
      link: 'https://twinkletradingconsult.com/'
    },
    {
      title: 'Ojala Logic',
      description: 'Web application showcasing logical solutions and interactive features with clean, modern UI/UX design.',
      tags: ['Web Development', 'JavaScript', 'UI/UX Design', 'Frontend'],
      icon: '💡',
      impact: 'Live at ojalogic.netlify.app',
      category: 'Web Development',
      link: 'https://ojalogic.netlify.app/'
    },
    {
      title: 'Tech Visualizer',
      description: 'Interactive technology visualization tool helping users understand complex technical concepts through visual representations.',
      tags: ['Web Development', 'Data Visualization', 'Interactive Tools', 'Education'],
      icon: '🔬',
      impact: 'Live at tech-visualizer.netlify.app',
      category: 'Web Development',
      link: 'https://tech-visualizer.netlify.app/'
    }
  ];

  const projectCategories = ['All', 'Management', 'Infrastructure', 'Security', 'Web Development'];

  const filteredProjects = activeFilter === 'All' 
    ? allProjects 
    : allProjects.filter(project => project.category === activeFilter);

  const serviceCategories = [
    {
      name: 'Strategic Services',
      icon: '🎯',
      services: [
        {
          title: 'IT Strategy & Consulting',
          description: 'Strategic IT planning and infrastructure optimization to align technology with business goals.',
          icon: '📋'
        },
        {
          title: 'Digital Transformation Consulting',
          description: 'Alignment of IT initiatives with business goals to drive digital transformation and operational efficiency.',
          icon: '🚀'
        },
        {
          title: 'IT Policy Development',
          description: 'Development of IT policies compliant with banking regulations and industry standards.',
          icon: '📜'
        },
        {
          title: 'Vendor Management',
          description: 'IT vendor performance management for cost-effectiveness and high-quality service delivery.',
          icon: '🤝'
        }
      ]
    },
    {
      name: 'Technical Services',
      icon: '⚙️',
      services: [
        {
          title: 'Infrastructure Management',
          description: 'Network design, server virtualization, and IT infrastructure optimization services.',
          icon: '🔧'
        },
        {
          title: 'Cloud Migration Services',
          description: 'Migration of critical applications to cloud platforms with improved scalability and cost reduction.',
          icon: '☁️'
        },
        {
          title: 'Mobile Banking Solutions',
          description: 'Mobile banking app implementation with payment gateway integrations (Interswitch, NIBSS, NIP).',
          icon: '📱'
        },
        {
          title: 'Web Development',
          description: 'Responsive frontend development using HTML, CSS, and JavaScript for optimal user experience.',
          icon: '🌐'
        },
        {
          title: 'API Integration Services',
          description: 'Integration of applications with third-party systems and seamless data flow solutions.',
          icon: '🔗'
        },
        {
          title: 'IT Support & Helpdesk Setup',
          description: 'Establishment of SLAs, escalation procedures, and incident management protocols for efficient support.',
          icon: '🎧'
        },
        {
          title: 'Performance Optimization',
          description: 'Proactive monitoring and performance tuning to boost system performance and reduce downtime.',
          icon: '⚡'
        }
      ]
    },
    {
      name: 'Security & Compliance',
      icon: '🔒',
      services: [
        {
          title: 'Data Protection & Compliance',
          description: 'Comprehensive data security audits and compliance frameworks for regulatory adherence.',
          icon: '🛡️'
        },
        {
          title: 'IT Security Audits',
          description: 'Network security configuration, vulnerability assessments, and breach prevention strategies.',
          icon: '🔐'
        },
        {
          title: 'Business Continuity Planning',
          description: 'Data protection, disaster recovery, and business continuity strategies to minimize downtime.',
          icon: '🔄'
        }
      ]
    },
    {
      name: 'Data Services',
      icon: '📊',
      services: [
        {
          title: 'Data Analysis & Visualization',
          description: 'Business intelligence, data analytics, and interactive dashboard development.',
          icon: '📈'
        },
        {
          title: 'Power BI Dashboard Development',
          description: 'Custom interactive dashboards and data visualization solutions for actionable insights.',
          icon: '📉'
        },
        {
          title: 'SQL Database Services',
          description: 'Data extraction, manipulation, modeling, and database optimization services.',
          icon: '🗄️'
        }
      ]
    },
    {
      name: 'Training & Enablement',
      icon: '👨‍🏫',
      services: [
        {
          title: 'Staff IT Training',
          description: 'Technical training programs to improve IT literacy and reduce support tickets.',
          icon: '👨‍🏫'
        }
      ]
    }
  ];

  const certifications = [
    { name: 'ITIL Foundation', year: '2022' },
    { name: 'Data Protection Officer', year: '2021' },
    { name: 'Network Administration', year: '2020' }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'CTO, Fintech Solutions',
      text: 'Oluwatobi transformed our IT infrastructure with remarkable efficiency. His expertise in data protection and compliance was invaluable to our organization.',
      avatar: '👩‍💼'
    },
    {
      name: 'Michael Chen',
      role: 'Operations Manager',
      text: 'Working with Oluwatobi was a game-changer. His analytical approach and technical skills helped us optimize our systems beyond expectations.',
      avatar: '👨‍💼'
    }
  ];

  const bgClass = darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-white via-gray-50 to-blue-50';
  const textClass = darkMode ? 'text-white' : 'text-gray-900';
  const cardBgClass = darkMode ? 'bg-gray-800' : 'bg-white';
  const borderClass = darkMode ? 'border-gray-700' : 'border-gray-200';
  const hoverBorderClass = darkMode ? 'hover:border-red-500' : 'hover:border-red-400';

  if (isLoading) {
    return (
      <div className={`${bgClass} min-h-screen flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600 mx-auto mb-4"></div>
          <p className={`text-xl ${textClass}`}>Loading Portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${bgClass} min-h-screen ${textClass} transition-colors duration-300`}>
      {/* Print Styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-break { page-break-after: always; }
          body { background: white !important; color: black !important; }
          .bg-gradient-to-r, .bg-gradient-to-br { background: white !important; }
        }
      `}</style>

      {/* Navbar */}
      <nav className={`no-print fixed top-0 w-full ${darkMode ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-sm z-50 border-b ${borderClass} shadow-sm transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <img 
                src={darkMode ? "/images/logo/2.png" : "/images/logo/2.png"} 
                alt="Daniels Logo" 
                className="h-6 w-auto object-contain"
              />
            </div>

            <div className="hidden md:flex space-x-8 items-center">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className={`${darkMode ? 'text-gray-300 hover:text-red-400' : 'text-gray-600 hover:text-red-600'} transition-colors duration-200 font-medium`}
                >
                  {link.name}
                </button>
              ))}
              <a
                href="/resume/Oluwatobi Daniel-Sodiya Full Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'} hover:scale-110 transition-all`}
                title="Print Resume"
              >
                <Printer size={20} />
              </a>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-gray-600'} hover:scale-110 transition-all`}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>

            <div className="md:hidden flex items-center gap-2">
              <a
                href="/resume/Oluwatobi Daniel-Sodiya Full Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}`}
                title="Print Resume"
              >
                <Printer size={18} />
              </a>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-full ${darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-gray-600'}`}
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={darkMode ? 'text-gray-300 hover:text-red-400' : 'text-gray-600 hover:text-red-600'}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className={`md:hidden ${darkMode ? 'bg-gray-800/95' : 'bg-white/95'} backdrop-blur-sm border-t ${borderClass}`}>
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className={`block w-full text-left px-3 py-2 ${darkMode ? 'text-gray-300 hover:text-red-400 hover:bg-gray-700/50' : 'text-gray-600 hover:text-red-600 hover:bg-gray-50'} rounded-md transition-colors duration-200`}
                >
                  {link.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="no-print fixed bottom-8 right-8 bg-gradient-to-r from-yellow-500 to-red-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:shadow-red-500/50 transition-all duration-300 transform hover:scale-110 z-50 animate-bounce"
          aria-label="Back to top"
        >
          <ArrowUp size={24} />
        </button>
      )}

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 pt-16 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-100"
          style={{
            backgroundImage: 'url(/images/hero/download.jpg)',
            filter: darkMode ? 'brightness(0.2)' : 'brightness(0.3)',
            transform: `translateY(${scrolled ? '50px' : '0'})`
          }}
        />
        <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-b from-black/70 via-black/50 to-transparent' : 'bg-gradient-to-b from-black/60 via-black/40 to-transparent'}`} />
        
        <div className="max-w-4xl mx-auto text-center relative z-10 animate-fade-in">
          <div className="mb-8">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-4 text-white drop-shadow-2xl animate-slide-down">
              Oluwatobi Daniels
            </h1>
            <h2 className="text-2xl sm:text-3xl md:text-4xl text-gray-100 mb-6 drop-shadow-md animate-slide-up">
              Digital Transformation Leader | IT Manager & Technology Strategist
            </h2>
            <p className="text-lg sm:text-xl text-gray-200 mb-8 max-w-2xl mx-auto drop-shadow-md animate-fade-in-delayed">
              Driving digital transformation through strategic IT management, application support excellence, data security compliance, and innovative web solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-delayed">
              <button
                onClick={() => scrollToSection('experience')}
                className="bg-gradient-to-r from-yellow-500 to-red-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 transform hover:scale-105"
              >
                View Experience
              </button>
              <a
                href="/resume/Oluwatobi Daniel-Sodiya Full Resume.pdf"
                download
                className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white border-2 border-white px-8 py-3 rounded-full font-semibold hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
              >
                <Download size={20} />
                Download Resume
              </a>
            </div>
          </div>
          <div className="mt-16 animate-bounce">
            <ChevronDown size={32} className="mx-auto text-white drop-shadow-lg" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-16 px-4 bg-gradient-to-r from-red-600 to-yellow-500 -mt-20 relative z-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center text-white transform hover:scale-110 transition-transform duration-300">
                <div className="flex justify-center mb-2">{stat.icon}</div>
                <div className="text-4xl md:text-5xl font-bold mb-2">
                  {stat.number}{stat.suffix}
                </div>
                <div className="text-sm md:text-base opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section 
        id="about" 
        className={`py-20 px-4 ${darkMode ? 'bg-gray-800/30' : 'bg-white/50'} transition-all duration-700 ${visibleSections.about ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            <User className="mr-3 text-red-600" size={32} />
            <h2 className={`text-4xl font-bold ${textClass}`}>About Me</h2>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0 w-full md:w-64">
              <img 
                src="/images/profile/profile.jpeg" 
                alt="Oluwatobi Daniel-Sodiya" 
                className="w-48 h-48 md:w-64 md:h-64 rounded-full object-cover border-4 border-red-600 shadow-xl mx-auto md:mx-0 hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            <div className="flex-1">
              <div className={`space-y-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'} text-lg leading-relaxed`}>
                <p>
                  Highly motivated and results-driven IT professional with over 5 years of progressive experience spanning technology application support management, IT infrastructure leadership, data analysis, and web development. Based in Lagos, Nigeria, I have a proven track record of driving digital transformation in the financial services sector.
                </p>
                <p>
                  As Technology Application Support Manager at Alphamead Group, I oversee business-critical applications and lead support teams. Previously as IT Manager & Data Protection Officer at Brent Mortgage Bank, I spearheaded mobile banking implementation with Interswitch, NIBBS, and NIP, achieving a 15% increase in customer transactions and optimizing infrastructure for 20% improved system performance.
                </p>
                <p>
                  My expertise encompasses IT infrastructure management, data protection compliance, application lifecycle management, and cross-functional team collaboration. I possess strong analytical, problem-solving, and communication skills with a passion for leveraging technology to drive organizational growth and enhance customer satisfaction.
                </p>
              </div>
            </div>
          </div>

          <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 p-6 ${cardBgClass} rounded-lg border ${borderClass} shadow-sm`}>
            <div>
              <p className="text-red-600 font-semibold">Location</p>
              <p className={textClass}>Lagos, Nigeria</p>
            </div>
            <div>
              <p className="text-red-600 font-semibold">Experience</p>
              <p className={textClass}>5+ Years</p>
            </div>
            <div>
              <p className="text-red-600 font-semibold">Education</p>
              <p className={textClass}>BSc Business Admin</p>
            </div>
          </div>

          <div className="mt-8">
            <h3 className={`text-2xl font-bold ${textClass} mb-4 flex items-center`}>
              <Award className="mr-2 text-red-600" size={24} />
              Certifications
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {certifications.map((cert, index) => (
                <div key={index} className={`${cardBgClass} p-4 rounded-lg border ${borderClass} ${hoverBorderClass} transition-all hover:shadow-lg transform hover:scale-105 duration-300`}>
                  <div className="flex items-start">
                    <CheckCircle className="text-red-600 mr-2 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <p className={`font-semibold ${textClass}`}>{cert.name}</p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{cert.year}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section 
        id="experience" 
        className={`py-20 px-4 print-break transition-all duration-700 ${visibleSections.experience ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-12">
            <Briefcase className="mr-3 text-red-600" size={32} />
            <h2 className={`text-4xl font-bold ${textClass}`}>Professional Experience</h2>
          </div>
          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <div
                key={index}
                className={`${cardBgClass} p-6 md:p-8 rounded-lg border ${borderClass} ${hoverBorderClass} hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]`}
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                  <div>
                    <h3 className={`text-xl md:text-2xl font-bold ${textClass} mb-2`}>{exp.title}</h3>
                    <p className="text-base md:text-lg text-red-600 font-semibold">{exp.company}</p>
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{exp.location}</p>
                  </div>
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} font-medium mt-2 md:mt-0 text-sm md:text-base`}>{exp.period}</span>
                </div>
                <ul className="space-y-3 mt-4">
                  {exp.achievements.map((achievement, i) => (
                    <li key={i} className={`flex items-start ${darkMode ? 'text-gray-300' : 'text-gray-700'} text-sm md:text-base`}>
                      <span className="text-red-600 mr-3 mt-1">▸</span>
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section 
        id="skills" 
        className={`py-20 px-4 ${darkMode ? 'bg-gray-800/30' : 'bg-white/50'} print-break transition-all duration-700 ${visibleSections.skills ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-12">
            <Code className="mr-3 text-red-600" size={32} />
            <h2 className={`text-4xl font-bold ${textClass}`}>Skills & Expertise</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {skills.map((skill, index) => (
              <div
                key={index}
                className={`${cardBgClass} p-4 md:p-6 rounded-lg border ${borderClass} ${hoverBorderClass} hover:shadow-lg transition-all duration-300 transform hover:scale-105`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 md:gap-3">
                    <span className="text-2xl md:text-3xl">{skill.icon}</span>
                    <div>
                      <h3 className={`text-base md:text-lg font-semibold ${textClass}`}>{skill.name}</h3>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{skill.category}</p>
                    </div>
                  </div>
                  <span className="text-red-600 font-bold text-sm md:text-base">{skill.level}%</span>
                </div>
                <div className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
                  <div 
                    className="bg-gradient-to-r from-yellow-500 to-red-600 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section 
        id="projects" 
        className={`py-20 px-4 transition-all duration-700 ${visibleSections.projects ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-8">
            <Shield className="mr-3 text-red-600" size={32} />
            <h2 className={`text-4xl font-bold ${textClass}`}>Key Projects</h2>
          </div>

          {/* Project Filter Buttons */}
          <div className="flex flex-wrap gap-3 mb-8 no-print justify-center">
            {projectCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`px-4 md:px-6 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 text-sm md:text-base ${
                  activeFilter === category
                    ? 'bg-gradient-to-r from-yellow-500 to-red-600 text-white shadow-lg'
                    : `${cardBgClass} ${textClass} border ${borderClass} hover:border-red-500`
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredProjects.map((project, index) => (
              <div
                key={index}
                className={`${cardBgClass} rounded-lg overflow-hidden border ${borderClass} ${hoverBorderClass} hover:shadow-xl hover:shadow-red-500/20 transition-all duration-300 transform hover:scale-105 ${project.link ? 'cursor-pointer' : ''}`}
              >
                <div className={`p-4 md:p-6 ${project.link ? '' : ''}`}>
                  {project.link ? (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <ProjectContent project={project} darkMode={darkMode} />
                    </a>
                  ) : (
                    <ProjectContent project={project} darkMode={darkMode} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className={`py-20 px-4 ${darkMode ? 'bg-gray-800/30' : 'bg-white/50'} transition-all duration-700 ${visibleSections.testimonials ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center mb-12">
            <Users className="mr-3 text-red-600" size={32} />
            <h2 className={`text-4xl font-bold ${textClass}`}>Client Testimonials</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`${cardBgClass} p-6 md:p-8 rounded-lg border ${borderClass} ${hoverBorderClass} hover:shadow-lg transition-all duration-300 transform hover:scale-105`}
              >
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} text-base md:text-lg mb-6 italic`}>"{testimonial.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="text-3xl md:text-4xl">{testimonial.avatar}</div>
                  <div>
                    <p className={`font-semibold ${textClass} text-base md:text-lg`}>{testimonial.name}</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section
        id="services"
        className={`py-20 px-4 print-break transition-all duration-700 ${visibleSections.services ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center mb-12">
            <Briefcase className="mr-3 text-red-600" size={32} />
            <h2 className={`text-4xl font-bold ${textClass}`}>Services Offered</h2>
          </div>
          
          {serviceCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-12">
              <div className="flex items-center mb-6">
                <span className="text-3xl mr-3">{category.icon}</span>
                <h3 className={`text-2xl font-bold ${textClass}`}>{category.name}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {category.services.map((service, index) => (
                  <div
                    key={index}
                    className={`${cardBgClass} p-6 md:p-8 rounded-lg border ${borderClass} ${hoverBorderClass} hover:shadow-lg transition-all duration-300 transform hover:scale-105`}
                  >
                    <div className="text-4xl md:text-5xl mb-4">{service.icon}</div>
                    <h3 className={`text-xl md:text-2xl font-bold ${textClass} mb-3`}>{service.title}</h3>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} text-sm md:text-base`}>{service.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section 
        id="contact" 
        className={`py-20 px-4 ${darkMode ? 'bg-gray-800/30' : 'bg-white/50'} transition-all duration-700 ${visibleSections.contact ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-8">
            <Mail className="mr-3 text-red-600" size={32} />
            <h2 className={`text-4xl font-bold ${textClass}`}>Get In Touch</h2>
          </div>
          <p className={`text-lg md:text-xl ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-12 max-w-2xl mx-auto text-center`}>
            I'm always open to discussing new opportunities, IT projects, or consulting engagements. Let's connect and explore how we can work together.
          </p>

          <div className={`${cardBgClass} p-6 md:p-8 rounded-lg border ${borderClass} shadow-lg mb-8`}>
            <form name="contact" method="POST" data-netlify="true" onSubmit={handleFormSubmit} className="space-y-6" netlify-honeypot="bot-field">
              <input type="hidden" name="form-name" value="contact" />
              <input type="hidden" name="bot-field" />
              <div>
                <label className={`block text-sm font-medium ${textClass} mb-2`}>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    formErrors.name ? 'border-red-500' : borderClass
                  } ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all`}
                  placeholder="Your Name"
                />
                {formErrors.name && (
                  <div className="flex items-center gap-1 mt-2 text-red-500 text-sm">
                    <AlertCircle size={16} />
                    <span>{formErrors.name}</span>
                  </div>
                )}
              </div>
              <div>
                <label className={`block text-sm font-medium ${textClass} mb-2`}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    formErrors.email ? 'border-red-500' : borderClass
                  } ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all`}
                  placeholder="your.email@example.com"
                />
                {formErrors.email && (
                  <div className="flex items-center gap-1 mt-2 text-red-500 text-sm">
                    <AlertCircle size={16} />
                    <span>{formErrors.email}</span>
                  </div>
                )}
              </div>
              <div>
                <label className={`block text-sm font-medium ${textClass} mb-2`}>Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={5}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    formErrors.message ? 'border-red-500' : borderClass
                  } ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all resize-none`}
                  placeholder="Tell me about your project or inquiry..."
                />
                {formErrors.message && (
                  <div className="flex items-center gap-1 mt-2 text-red-500 text-sm">
                    <AlertCircle size={16} />
                    <span>{formErrors.message}</span>
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={formStatus === 'sending'}
                className="w-full bg-gradient-to-r from-yellow-500 to-red-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {formStatus === 'sending' ? (
                  <>Sending...</>
                ) : (
                  <>
                    <Send size={20} />
                    Send Message
                  </>
                )}
              </button>
              {formStatus === 'success' && (
                <div className="bg-green-100 border border-green-500 text-green-800 px-4 py-3 rounded-lg text-center flex items-center justify-center gap-2">
                  <CheckCircle size={20} />
                  Message sent successfully! I'll get back to you soon.
                </div>
              )}
              {formStatus === 'error' && formErrorMessage && (
                <div className="bg-red-100 border border-red-500 text-red-800 px-4 py-3 rounded-lg text-center flex items-center justify-center gap-2">
                  <AlertCircle size={20} />
                  {formErrorMessage}
                </div>
              )}
            </form>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-6 mb-8">
            <a
              href="mailto:towbeedaniels@gmail.com"
              className="flex items-center gap-2 px-4 md:px-6 py-3 bg-gradient-to-r from-yellow-500 to-red-600 text-white rounded-full hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300 transform hover:scale-110 text-sm md:text-base"
            >
              <Mail size={20} />
              <span className="hidden sm:inline">towbeedaniels@gmail.com</span>
              <span className="sm:hidden">Email</span>
            </a>
            <a
              href="tel:+2348059830917"
              className={`flex items-center gap-2 px-4 md:px-6 py-3 ${cardBgClass} border ${borderClass} ${darkMode ? 'text-gray-300' : 'text-gray-700'} rounded-full ${hoverBorderClass} hover:shadow-lg transition-all duration-300 transform hover:scale-110 text-sm md:text-base`}
            >
              📞 <span className="hidden sm:inline">+234 805 983 0917</span>
              <span className="sm:hidden">Call</span>
            </a>
          </div>
          <div className="flex justify-center items-center gap-4 md:gap-6 flex-wrap">
            <a
              href="https://linkedin.com/in/oluwatobi-daniel-sodiya"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 px-4 md:px-6 py-3 ${cardBgClass} border ${borderClass} ${darkMode ? 'text-gray-300' : 'text-gray-700'} rounded-full ${hoverBorderClass} hover:shadow-lg transition-all duration-300 transform hover:scale-110 text-sm md:text-base`}
            >
              <Linkedin size={20} />
              LinkedIn
            </a>
            <a
              href="https://github.com/towbeedaniels"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 px-4 md:px-6 py-3 ${cardBgClass} border ${borderClass} ${darkMode ? 'text-gray-300' : 'text-gray-700'} rounded-full ${hoverBorderClass} hover:shadow-lg transition-all duration-300 transform hover:scale-110 text-sm md:text-base`}
            >
              <Github size={20} />
              GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-8 px-4 border-t ${borderClass} ${darkMode ? 'bg-gray-900/70' : 'bg-white/70'}`}>
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <img 
              src={darkMode ? "/images/logo/1.png" : "/images/logo/2.png"} 
              alt="Daniels Logo" 
              className="h-14 w-auto object-contain max-h-14"
            />
          </div>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>© {new Date().getFullYear()} Oluwatobi Daniel-Sodiya. All rights reserved.</p>
          <p className={`mt-2 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Digital Transformation Leader | IT Manager & Technology Strategist</p>
        </div>
      </footer>

      {/* Custom Animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-down {
          from { 
            opacity: 0;
            transform: translateY(-20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-up {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-fade-in-delayed {
          animation: fade-in 1s ease-out 0.3s both;
        }
        
        .animate-slide-down {
          animation: slide-down 0.8s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out 0.2s both;
        }
      `}</style>
    </div>
  );
}