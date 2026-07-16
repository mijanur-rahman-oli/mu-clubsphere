import { AiOutlineInfoCircle } from 'react-icons/ai'
import Container from '../../components/Shared/Container'
import { 
  Target, 
  Eye, 
  Heart, 
  Users, 
  Award, 
  TrendingUp,
  Shield,
  Zap,
  Globe,
  Star,
  CheckCircle,
  ArrowRight
} from 'lucide-react'

const About = () => {
  const stats = [
    { icon: <Users className="w-6 h-6" />, value: '10,000+', label: 'Active Members', color: 'blue' },
    { icon: <Award className="w-6 h-6" />, value: '500+', label: 'Clubs & Communities', color: 'green' },
    { icon: <TrendingUp className="w-6 h-6" />, value: '1,000+', label: 'Events Hosted', color: 'purple' },
    { icon: <Star className="w-6 h-6" />, value: '95%', label: 'Satisfaction Rate', color: 'orange' }
  ]

  const values = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Community First',
      description: 'We believe in the power of bringing people together and fostering meaningful connections.',
      color: 'rose'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Trust & Safety',
      description: 'Creating a safe, inclusive environment where everyone feels welcome and respected.',
      color: 'blue'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Innovation',
      description: 'Continuously improving our platform to provide the best experience for our members.',
      color: 'yellow'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Diversity',
      description: 'Celebrating diverse perspectives, backgrounds, and interests in our community.',
      color: 'green'
    }
  ]

  const features = [
    'Easy club creation and management',
    'Secure event registration system',
    'Member engagement tools',
    'Real-time notifications',
    'Advanced search and filtering',
    'Mobile-friendly interface',
    'Community forums and discussions',
    'Integrated payment processing'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 py-20 md:py-24 transition-colors duration-300">
      <Container>
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-lime-500 to-green-600 rounded-xl mb-3 shadow-lg">
            <AiOutlineInfoCircle className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">About ClubSphere</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Empowering communities to connect, collaborate, and grow together
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-8 transition-colors">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-lime-500 to-green-600 rounded-xl mb-4">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                To create a vibrant platform where individuals can discover their passions, 
                connect with like-minded people, and build lasting relationships through 
                organized clubs and engaging events. We strive to make community building 
                accessible, enjoyable, and rewarding for everyone.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-8 transition-colors">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl mb-4">
                <Eye className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Vision</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                To become the world's leading platform for community engagement, where every 
                person can find their tribe and every club can thrive. We envision a future 
                where meaningful connections are just a click away, and communities flourish 
                through shared experiences and mutual support.
              </p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="py-16 border-t border-gray-200 dark:border-gray-800">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Our Impact</h2>
            <p className="text-gray-600 dark:text-gray-400">Making a difference in communities worldwide</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const colors = {
                blue: 'from-blue-500 to-blue-600',
                green: 'from-green-500 to-green-600',
                purple: 'from-purple-500 to-purple-600',
                orange: 'from-orange-500 to-orange-600'
              }
              return (
                <div key={index} className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 text-center hover:shadow-lg transition-all">
                  <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${colors[stat.color]} rounded-xl mb-4 text-white`}>
                    {stat.icon}
                  </div>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</p>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Core Values */}
        <div className="py-16 border-t border-gray-200 dark:border-gray-800">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Our Core Values</h2>
            <p className="text-gray-600 dark:text-gray-400">The principles that guide everything we do</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const colors = {
                rose: 'bg-rose-100 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400',
                blue: 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
                yellow: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400',
                green: 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
              }
              return (
                <div key={index} className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-all group">
                  <div className={`inline-flex items-center justify-center w-14 h-14 ${colors[value.color]} rounded-xl mb-4 group-hover:scale-110 transition-transform`}>
                    {value.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{value.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{value.description}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Features */}
        <div className="py-16 border-t border-gray-200 dark:border-gray-800">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">What We Offer</h2>
            <p className="text-gray-600 dark:text-gray-400">Everything you need to build and grow your community</p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-8 md:p-12 transition-colors">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 group">
                  <div className="flex-shrink-0 mt-1">
                    <CheckCircle className="w-5 h-5 text-lime-600 dark:text-lime-500 group-hover:scale-110 transition-transform" />
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 font-medium">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default About