import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router'; // Fixed: was 'react-router' → should be 'react-router-dom'
import { Users, Calendar, Sparkles, Target, Heart, TrendingUp } from 'lucide-react';
import axios from 'axios'; // Make sure axios is installed and imported

const Container = ({ children }) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
);

const ClubCard = ({ club, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -10, transition: { duration: 0.2 } }}
    >
      <Link to={`/club/${club._id}`}>
        <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
          <div className="relative h-48 overflow-hidden">
            <motion.img
              src={club.image || 'https://via.placeholder.com/400x300?text=No+Image'}
              alt={club.name}
              className="w-full h-full object-cover"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            />
            <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-sm font-semibold text-gray-800">
              {club.category || 'General'}
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-bold text-lg mb-2">{club.name}</h3>
            <div className="flex items-center text-gray-600 text-sm">
              <Users size={16} className="mr-1" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const Home = () => {
  // Fetch all clubs from backend
  const { data: clubs = [], isLoading } = useQuery({
    queryKey: ['clubs'],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/clubs`);
      return response.data;
    },
    // Optional: limit to 6 for featured look (same as mock)
    select: (data) => data.slice(0, 6),
  });

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const howItWorksSteps = [
    {
      icon: <Users size={40} />,
      title: 'Create Account',
      description: 'Sign up and complete your profile in minutes'
    },
    {
      icon: <Sparkles size={40} />,
      title: 'Discover Clubs',
      description: 'Browse through hundreds of student organizations'
    },
    {
      icon: <Heart size={40} />,
      title: 'Join & Connect',
      description: 'Become a member and start networking'
    },
    {
      icon: <Calendar size={40} />,
      title: 'Attend Events',
      description: 'Participate in exciting club activities and events'
    }
  ];

  const benefits = [
    {
      icon: <Target size={32} />,
      title: 'Find Your Passion',
      description: 'Explore diverse clubs matching your interests'
    },
    {
      icon: <Users size={32} />,
      title: 'Build Network',
      description: 'Connect with like-minded students'
    },
    {
      icon: <TrendingUp size={32} />,
      title: 'Develop Skills',
      description: 'Gain leadership and practical experience'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      
      {/* Hero Section with Background Image */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://i.ibb.co.com/VpPBzTwm/cover-For-Club.jpg"
            alt="Diverse group of smiling college students connecting and discovering clubs"
            className="w-full h-full object-cover"
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/70 to-purple-600/70" />
        </div>

        <Container>
          <motion.div
            className="relative flex flex-col items-center justify-center text-center min-h-[70vh] md:min-h-[80vh]"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-2xl md:text-5xl font-extrabold mb-6">
              Discover Clubs That Inspire You
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl">
              Explore local organizations, find your passion, and connect with us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/club">
                <motion.button
                  className="bg-white text-blue-600 font-semibold px-8 py-4 rounded-lg shadow-lg"
                  whileHover={{ scale: 1.05, backgroundColor: '#e0f2ff' }}
                  whileTap={{ scale: 0.95 }}
                >
                  Join a Club
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Featured Clubs Section */}
      <section className="py-8 md:py-15">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-12">
              <motion.h2 
                className="text-2xl md:text-3xl font-semibold mb-4"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                Featured Clubs
              </motion.h2>
              <motion.p 
                className="text-gray-600 text-lg max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                Discover the most popular clubs with active communities
              </motion.p>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <motion.div
                  className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {clubs.map((club, index) => (
                  <ClubCard key={club._id} club={club} index={index} />
                ))}
              </div>
            )}

            <motion.div 
              className="text-center mt-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <Link to="/club">
                <motion.button
                  className="text-blue-600 font-semibold text-lg border-2 border-blue-600 px-8 py-3 rounded-lg"
                  whileHover={{ scale: 1.05, backgroundColor: '#2563eb', color: 'white' }}
                  whileTap={{ scale: 0.95 }}
                >
                  View All Clubs →
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-blue-50 to-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                How ClubSphere Works
              </h2>
              <p className="text-gray-600 text-lg">
                Getting started is easy! Follow these simple steps
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {howItWorksSteps.map((step, index) => (
                <motion.div
                  key={index}
                  className="relative"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                >
                  <motion.div
                    className="bg-white p-6 rounded-xl shadow-lg text-center"
                    whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                  >
                    <motion.div
                      className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full mb-4"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      {step.icon}
                    </motion.div>
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {index + 1}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </motion.div>
                  
                  {index < howItWorksSteps.length - 1 && (
                    <motion.div
                      className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: (index + 1) * 0.15 }}
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Why Join Section */}
      <section className="py-16 md:py-24">
        <Container>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                Why Join a Club?
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Being part of a club enriches your college experience in countless ways
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-br from-blue-500 to-purple-600 p-8 rounded-2xl text-white"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
                  }}
                >
                  <motion.div
                    className="mb-4"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    {benefit.icon}
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-3">{benefit.title}</h3>
                  <p className="text-blue-100">{benefit.description}</p>
                </motion.div>
              ))}
            </div>

            <motion.div 
              className="mt-16 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
            </motion.div>
          </motion.div>
        </Container>
      </section>
    </div>
  );
};

export default Home;