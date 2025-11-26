import React from "react";

interface ReviewProps {
  handleNext: () => void;
  handlePrevious: () => void;
  handleEditStep?: (stepNumber: number) => void;
}

const Review: React.FC<ReviewProps> = ({
  handleNext,
  handlePrevious,
  handleEditStep,
}) => {
  // This would typically come from your state management or context
  // For now, we'll use placeholder data
  const userData = {
    professionalBackground: {
      industry: "Technology",
      experience: "3 years",
      skills: ["React", "TypeScript", "Node.js"],
    },
    careerGoals: {
      shortTerm: "Become a senior developer",
      longTerm: "Start my own tech company",
    },
    mentoringPreferences: {
      meetingFrequency: "Weekly",
      areasOfInterest: ["Career Growth", "Technical Skills"],
    },
  };

  const handleEdit = (stepNumber: number) => {
    if (handleEditStep) {
      handleEditStep(stepNumber);
    }
  };

  const handleSubmit = () => {
    // Handle final submission
    console.log("Submitting onboarding data...");
    handleNext(); // Or redirect to dashboard
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Review Your Information
        </h2>
        <p className="mt-2 text-gray-600">
          Please review all your information before submitting. You can go back
          to make changes if needed.
        </p>
      </div>

      {/* Professional Background Review */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Professional Background
          </h3>
          <button
            onClick={() => handleEdit(1)}
            className="text-[#334AFF] hover:text-[#251F99] font-medium text-sm"
          >
            Edit
          </button>
        </div>
        <div className="space-y-2 text-gray-700">
          <p>
            <strong>Industry:</strong>{" "}
            {userData.professionalBackground.industry}
          </p>
          <p>
            <strong>Experience:</strong>{" "}
            {userData.professionalBackground.experience}
          </p>
          <p>
            <strong>Skills:</strong>{" "}
            {userData.professionalBackground.skills.join(", ")}
          </p>
        </div>
      </div>

      {/* Career Goals Review (Only for mentees) */}
      {userData.careerGoals && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Career Goals
            </h3>
            <button
              onClick={() => handleEdit(2)}
              className="text-[#334AFF] hover:text-[#251F99] font-medium text-sm"
            >
              Edit
            </button>
          </div>
          <div className="space-y-2 text-gray-700">
            <p>
              <strong>Short Term:</strong> {userData.careerGoals.shortTerm}
            </p>
            <p>
              <strong>Long Term:</strong> {userData.careerGoals.longTerm}
            </p>
          </div>
        </div>
      )}

      {/* Mentoring Preferences Review (For mentees and mentors) */}
      {userData.mentoringPreferences && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {userData.careerGoals
                ? "Mentor Preferences"
                : "Mentoring Preferences"}
            </h3>
            <button
              onClick={() => handleEdit(userData.careerGoals ? 3 : 2)}
              className="text-[#334AFF] hover:text-[#251F99] font-medium text-sm"
            >
              Edit
            </button>
          </div>
          <div className="space-y-2 text-gray-700">
            <p>
              <strong>Meeting Frequency:</strong>{" "}
              {userData.mentoringPreferences.meetingFrequency}
            </p>
            <p>
              <strong>Areas of Interest:</strong>{" "}
              {userData.mentoringPreferences.areasOfInterest.join(", ")}
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 mt-8">
        <button
          type="button"
          onClick={handlePrevious}
          className="flex-1 justify-center rounded-md border border-gray-300 bg-white px-3 py-3 text-[16px] font-semibold text-gray-700 shadow-xs hover:bg-gray-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="flex-1 justify-center rounded-md bg-[#334AFF] px-3 py-3 text-[16px] font-semibold text-white shadow-xs hover:bg-[#251F99]"
        >
          Submit & Complete
        </button>
      </div>
    </div>
  );
};

export default Review;
