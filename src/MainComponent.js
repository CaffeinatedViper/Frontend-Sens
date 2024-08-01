import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from 'react-spring';
import { Menu, X, Facebook, Instagram, Twitter, ArrowLeft } from 'lucide-react';

const SensoriumWebsite = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activePost, setActivePost] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const videoRef = useRef(null);

  const sections = ['home', 'posts', 'about', 'contact'];

  const posts = [
    { 
      id: 1, 
      title: 'Exploring Virtual Reality', 
      excerpt: 'Dive into the world of VR and its impact on our senses.', 
      content: 'Full content of the VR post...', 
      thumbnail: '/optic.jpg'
    },
    { 
      id: 2, 
      title: 'The Art of Sound Design', 
      excerpt: 'Discover how sound shapes our perception of reality.', 
      content: 'Full content of the sound design post...', 
      thumbnail: '/exhibition.jpg'
    },
    { 
      id: 3, 
      title: 'Visual Illusions in Digital Art', 
      excerpt: 'Explore the fascinating world of visual illusions in digital mediums.', 
      content: 'Full content of the visual illusions post...', 
      thumbnail: '/debate.jpg'
    },
    { 
      id: 4, 
      title: 'The Future of Haptic Feedback', 
      excerpt: 'Learn about emerging technologies in touch sensation.', 
      content: 'Full content of the haptic feedback post...', 
      thumbnail: '/workshop.jpg'
    },
  ];

  const springProps = useSpring({
    width: `${scrollProgress}%`,
    config: { tension: 300, friction: 20 }
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;
      const scrollPercentage = (scrollPosition / (fullHeight - windowHeight)) * 100;
      setScrollProgress(scrollPercentage);
      
      sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop - windowHeight / 2 && 
              scrollPosition < offsetTop + offsetHeight - windowHeight / 2) {
            setActiveSection(section);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error("Error attempting to play video: ", error);
      });
    }
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const openPost = (post) => {
    setActivePost(post);
    document.body.style.overflow = 'hidden';
  };

  const closePost = () => {
    setActivePost(null);
    document.body.style.overflow = 'auto';
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = document.querySelector('nav').offsetHeight;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Navbar with Progress Bar */}
      <motion.nav 
        className="fixed top-0 left-0 right-0 bg-white shadow-md z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div 
            className="text-2xl font-bold cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => scrollToSection('home')}
          >
            Sensorium
          </motion.div>
          <div className="hidden md:flex space-x-4">
            {sections.map(section => (
              <motion.div
                key={section}
                className={`capitalize cursor-pointer ${activeSection === section ? 'text-blue-600' : 'text-gray-600'}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => scrollToSection(section)}
              >
                {section}
              </motion.div>
            ))}
          </div>
          <motion.div 
            className="md:hidden cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </motion.div>
        </div>
        {/* Progress Bar */}
        <div className="w-full h-1 bg-gray-200">
          <animated.div 
            className="h-full bg-black"
            style={springProps}
          />
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-gray-800 bg-opacity-75 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl z-50"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
            >
              <div className="flex flex-col h-full justify-between">
                <div className="p-4">
                  <div className="flex justify-end">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={toggleMenu}
                    >
                      <X />
                    </motion.div>
                  </div>
                  <div className="mt-8 space-y-4">
                    {sections.map(section => (
                      <motion.div
                        key={section}
                        className={`block capitalize text-lg cursor-pointer ${activeSection === section ? 'text-blue-600' : 'text-gray-600'}`}
                        whileHover={{ scale: 1.1, originX: 0 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          scrollToSection(section);
                          toggleMenu();
                        }}
                      >
                        {section}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="pt-16">
        {/* Home Section with Video Background */}
        <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <video 
            ref={videoRef}
            autoPlay 
            loop 
            muted 
            playsInline
            preload="auto"
            className="absolute z-0 w-auto min-w-full min-h-full max-w-none object-cover"
          >
            <source src="/bg.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
          <div className="relative z-10 text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl font-bold mb-4 text-shadow-lg">Welcome to Sensorium</h1>
              <p className="text-xl mb-8 text-shadow-md">Immerse yourself in a world of sensory experiences</p>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-white text-blue-500 px-6 py-3 rounded-full font-semibold"
                onClick={() => scrollToSection('posts')}
              >
                Explore Now
              </motion.button>
            </motion.div>
          </div>
        </section>


        {/* Posts Section */}
        <section id="posts" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Latest Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {posts.map(post => (
                <motion.div
                  key={post.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gray-100 rounded-lg shadow-lg overflow-hidden cursor-pointer"
                  onClick={() => openPost(post)}
                >
                  <div className="aspect-w-16 aspect-h-9">
                    <img 
                      src={post.thumbnail} 
                      alt={post.title} 
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                    <p className="text-gray-600">{post.excerpt}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">About Sensorium</h2>
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-lg mb-6">
                Sensorium is a cutting-edge multimedia experience that pushes the boundaries of sensory perception. 
                Our mission is to create immersive environments that engage all your senses, 
                transporting you to new realms of imagination and wonder.
              </p>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-blue-500 text-white px-6 py-3 rounded-full font-semibold"
              >
                Learn More
              </motion.button>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Contact Us</h2>
            <div className="max-w-md mx-auto">
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block mb-1 font-medium">Name</label>
                  <input type="text" id="name" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label htmlFor="email" className="block mb-1 font-medium">Email</label>
                  <input type="email" id="email" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label htmlFor="message" className="block mb-1 font-medium">Message</label>
                  <textarea id="message" rows={4} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold"
                >
                  Send Message
                </motion.button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-2xl font-bold mb-4 md:mb-0">Sensorium</div>
            <div className="flex space-x-4">
              <motion.a href="#" whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }}>
                <Facebook />
              </motion.a>
              <motion.a href="#" whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }}>
                <Instagram />
              </motion.a>
              <motion.a href="#" whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }}>
                <Twitter />
              </motion.a>
            </div>
          </div>
          <div className="mt-4 text-center text-sm">
            © 2024 Sensorium. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Post Modal */}
      <AnimatePresence>
        {activePost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">{activePost.title}</h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={closePost}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <ArrowLeft />
                  </motion.button>
                </div>
                <img 
                  src={activePost.thumbnail} 
                  alt={activePost.title} 
                  className="w-full h-48 object-cover mb-4 rounded"
                />
                <p className="text-gray-600">{activePost.content}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SensoriumWebsite;