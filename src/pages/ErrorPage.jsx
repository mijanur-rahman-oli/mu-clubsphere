import Button from '../components/Shared/Button/Button'
import { useNavigate } from 'react-router'

const ErrorPage = () => {
  const navigate = useNavigate()

  return (
    <section className='bg-white selection:bg-lime-100'>
      <div className='container flex items-center min-h-screen px-6 py-12 mx-auto'>
        <div className='flex flex-col items-center max-w-sm mx-auto text-center'>
          
          {/* Icon Header: Changed bg-blue-50 to bg-lime-50 for color harmony */}
          <div className='p-4 text-lime-600 rounded-full bg-lime-50 ring-8 ring-lime-50/50'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth='2'
              stroke='currentColor'
              className='w-8 h-8'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z'
              />
            </svg>
          </div>

          <h1 className='mt-6 text-3xl font-bold text-gray-900 tracking-tight md:text-4xl'>
            Page not found
          </h1>
          
          <p className='mt-4 text-base text-gray-600 leading-relaxed'>
            The page you are looking for doesn't exist or has been moved. 
            Try going back or head home to start over.
          </p>

          <div className='flex flex-col sm:flex-row items-center justify-center w-full mt-8 gap-3 shrink-0'>
            {/* Professional "Go Back" Button */}
            <button
              onClick={() => navigate(-1)}
              className='flex items-center justify-center w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-gray-700 transition-all duration-200 bg-white border border-gray-200 rounded-xl gap-x-2 hover:bg-gray-50 hover:border-gray-300 active:scale-95 shadow-sm'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='2'
                stroke='currentColor'
                className='w-4 h-4 text-gray-500'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18'
                />
              </svg>
              <span>Go back</span>
            </button>

            <div className='w-full sm:w-auto'>
              <Button 
                label={'Take Me Home'} 
                onClick={() => navigate('/')} 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ErrorPage