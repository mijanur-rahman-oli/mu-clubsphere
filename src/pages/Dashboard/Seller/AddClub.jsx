import React from 'react';
import AddClubForm from '../../../components/Form/AddClubForm';

const AddClub = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
      <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-10" />

      <AddClubForm />
    </div>
  );
};

export default AddClub;