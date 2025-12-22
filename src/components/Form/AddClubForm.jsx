import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { imageUpload } from '../../utils';
import useAuth from '../../hooks/useAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { TbFidgetSpinner } from 'react-icons/tb';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { 
  Upload, 
  Image, 
  FileText, 
  DollarSign, 
  Tag, 
  Info,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const AddClubForm = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  const selectedImage = watch('image');
  const description = watch('description', '');

  // Auto preview when user selects an image
  React.useEffect(() => {
    if (selectedImage && selectedImage[0]) {
      const file = selectedImage[0];
      setImagePreview(URL.createObjectURL(file));
    }
  }, [selectedImage]);

  const { mutateAsync: addClub, isPending } = useMutation({
    mutationFn: async (clubData) => {
      const { data } = await axiosSecure.post('/clubs', clubData);
      return data;
    },
    onSuccess: () => {
      toast.success('Club added successfully!');
      queryClient.invalidateQueries(['my-inventory']);
      reset();
      setImagePreview(null);
    },
    onError: (error) => {
      console.error('Error adding club:', error);
      toast.error(error.response?.data?.message || 'Failed to add club');
    },
  });

  const onSubmit = async (data) => {
    const { name, description, price, category, image } = data;
    const imageFile = image[0];

    if (!imageFile) {
      toast.error('Please upload a club image');
      return;
    }

    try {
      setUploadingImage(true);
      const imageUrl = await imageUpload(imageFile);

      const clubData = {
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        category,
        image: imageUrl,
        seller: {
          name: user?.displayName || 'Anonymous',
          email: user?.email,
          image: user?.photoURL || '',
        },
      };

      await addClub(clubData);
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        document.getElementById('image').files = dataTransfer.files;
        setImagePreview(URL.createObjectURL(file));
      } else {
        toast.error('Please upload an image file');
      }
    }
  };

  const categories = [
    { value: 'Sports', icon: '⚽', color: 'text-blue-600' },
    { value: 'Social', icon: '🤝', color: 'text-purple-600' },
    { value: 'Cultural', icon: '🎭', color: 'text-pink-600' },
    { value: 'Debating', icon: '💬', color: 'text-orange-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-lime-500 to-green-600 rounded-2xl mb-4 shadow-lg">
            <Upload className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Create New Club</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Fill in the details below to list your club and start building your community
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              
              {/* Left Column - Main Details (2/3 width) */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* Club Name */}
                <div>
                  <label htmlFor="name" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <FileText className="w-4 h-4 text-lime-600" />
                    Club Name
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Enter your club name (e.g., Photography Enthusiasts)"
                    className={`w-full px-4 py-3.5 rounded-xl border-2 transition-all duration-200 bg-gray-50 focus:bg-white ${
                      errors.name 
                        ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                        : 'border-gray-200 focus:border-lime-500 focus:ring-4 focus:ring-lime-100'
                    }`}
                    {...register('name', {
                      required: 'Club name is required',
                      maxLength: { value: 50, message: 'Name too long (max 50 characters)' },
                    })}
                  />
                  {errors.name && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      {errors.name.message}
                    </div>
                  )}
                </div>

                {/* Category & Price Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* Category */}
                  <div>
                    <label htmlFor="category" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <Tag className="w-4 h-4 text-lime-600" />
                      Category
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="category"
                      className={`w-full px-4 py-3.5 rounded-xl border-2 transition-all duration-200 bg-gray-50 focus:bg-white ${
                        errors.category 
                          ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                          : 'border-gray-200 focus:border-lime-500 focus:ring-4 focus:ring-lime-100'
                      }`}
                      {...register('category', { required: 'Please select a category' })}
                    >
                      <option value="">Select a category</option>
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>
                          {cat.icon} {cat.value}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        {errors.category.message}
                      </div>
                    )}
                  </div>

                  {/* Membership Fee */}
                  <div>
                    <label htmlFor="price" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      <DollarSign className="w-4 h-4 text-lime-600" />
                      Membership Fee
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                      <input
                        type="number"
                        id="price"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        className={`w-full pl-8 pr-4 py-3.5 rounded-xl border-2 transition-all duration-200 bg-gray-50 focus:bg-white ${
                          errors.price 
                            ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                            : 'border-gray-200 focus:border-lime-500 focus:ring-4 focus:ring-lime-100'
                        }`}
                        {...register('price', {
                          required: 'Membership fee is required',
                          min: { value: 0, message: 'Fee cannot be negative' },
                        })}
                      />
                    </div>
                    {errors.price && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        {errors.price.message}
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <Info className="w-4 h-4 text-lime-600" />
                    Club Description
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <textarea
                      id="description"
                      rows="7"
                      placeholder="Describe your club's mission, activities, meeting schedule, benefits, and what makes it special..."
                      className={`w-full px-4 py-3.5 rounded-xl border-2 transition-all duration-200 bg-gray-50 focus:bg-white resize-none ${
                        errors.description 
                          ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                          : 'border-gray-200 focus:border-lime-500 focus:ring-4 focus:ring-lime-100'
                      }`}
                      {...register('description', {
                        required: 'Description is required',
                        minLength: { value: 50, message: 'Description should be at least 50 characters' },
                      })}
                    />
                    <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-white px-2 py-1 rounded-md">
                      {description.length}/50 min
                    </div>
                  </div>
                  {errors.description && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      {errors.description.message}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Image Upload (1/3 width) */}
              <div className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <Image className="w-4 h-4 text-lime-600" />
                    Club Image
                    <span className="text-red-500">*</span>
                  </label>

                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300 ${
                      dragActive 
                        ? 'border-lime-500 bg-lime-50 scale-105' 
                        : errors.image
                          ? 'border-red-300 bg-red-50'
                          : 'border-gray-300 bg-gray-50 hover:border-lime-400 hover:bg-lime-50'
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      id="image"
                      className="hidden"
                      {...register('image', { required: 'Club image is required' })}
                    />
                    <label
                      htmlFor="image"
                      className="cursor-pointer block"
                    >
                      {imagePreview ? (
                        <div className="space-y-4">
                          <div className="relative group">
                            <img
                              src={imagePreview}
                              alt="Club preview"
                              className="mx-auto max-h-72 rounded-xl shadow-lg object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-xl transition-all duration-300 flex items-center justify-center">
                              <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <Upload className="w-8 h-8 mx-auto mb-2" />
                                <p className="text-sm font-medium">Click to change</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-center gap-2 text-sm text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            Image selected
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4 py-8">
                          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-lime-100 to-green-100 rounded-full flex items-center justify-center">
                            <Image className="w-10 h-10 text-lime-600" />
                          </div>
                          <div>
                            <p className="text-lg font-semibold text-gray-700 mb-1">
                              Upload Club Image
                            </p>
                            <p className="text-sm text-gray-500">
                              Drag & drop or click to browse
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                              PNG, JPG up to 10MB
                            </p>
                          </div>
                        </div>
                      )}
                    </label>
                  </div>

                  {errors.image && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-red-600">
                      <AlertCircle className="w-4 h-4" />
                      {errors.image.message}
                    </div>
                  )}
                  
                  {uploadingImage && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-lg">
                      <TbFidgetSpinner className="animate-spin" />
                      Uploading image...
                    </div>
                  )}
                </div>

                {/* Tips Section */}
                <div className="bg-gradient-to-br from-lime-50 to-green-50 border border-lime-200 rounded-xl p-5">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Info className="w-5 h-5 text-lime-600" />
                    Image Tips
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-lime-600 mt-0.5 flex-shrink-0" />
                      Use high-quality, clear images
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-lime-600 mt-0.5 flex-shrink-0" />
                      Square format works best
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-lime-600 mt-0.5 flex-shrink-0" />
                      Show your club's personality
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-10 pt-8 border-t border-gray-200">
              <button
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={isPending || uploadingImage}
                className="w-full py-4 px-8 bg-gradient-to-r from-lime-600 to-green-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl hover:from-lime-700 hover:to-green-700 focus:outline-none focus:ring-4 focus:ring-lime-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0"
              >
                {isPending || uploadingImage ? (
                  <span className="flex items-center justify-center gap-3">
                    <TbFidgetSpinner className="animate-spin text-2xl" />
                    {uploadingImage ? 'Uploading Image...' : 'Creating Club...'}
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-6 h-6" />
                    Create Club
                  </span>
                )}
              </button>
              <p className="text-center text-sm text-gray-500 mt-4">
                By creating a club, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddClubForm;