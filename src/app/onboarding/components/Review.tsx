import React, { useState, useEffect } from "react";
import { useOnboardingStore } from "@/store/onboardingStore";
import { useAccessToken, useAuthStore, useUser } from "@/store/authStore";
import { OnboardingOption } from "@/interface/onboarding";
import {
  fetchIndustries,
  fetchSkills,
  fetchCareerGoals,
  fetchMentoringFrequency,
  submitOnboardingInformation, // Import the submission function
} from "@/utilities/handlers/onboardingHandler";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, ArrowLeft, CheckCircle2, FileText } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { handleErrorMessage } from "@/utilities/handleErrorMessage";

interface ReviewProps {
  handleNext: () => void;
  handlePrevious: () => void;
  handleEditStep?: (stepNumber: number) => void;
}

const Review: React.FC<ReviewProps> = ({ handlePrevious, handleEditStep }) => {
  const { getAllOnboardingData } = useOnboardingStore();
  const user = useUser();
  const accessToken = useAccessToken();

  const [industries, setIndustries] = useState<OnboardingOption[]>([]);
  const [skills, setSkills] = useState<OnboardingOption[]>([]);
  const [careerGoals, setCareerGoals] = useState<OnboardingOption[]>([]);
  const [mentoringFrequencies, setMentoringFrequencies] = useState<
    OnboardingOption[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [agreeToCodeOfConduct, setAgreeToCodeOfConduct] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userType = user?.user_type || "regular";
  const onboardingData = getAllOnboardingData();
  const { updateUser } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [industriesData, skillsData, careerGoalsData, frequencyData] =
          await Promise.all([
            fetchIndustries(),
            fetchSkills(),
            fetchCareerGoals(),
            fetchMentoringFrequency(),
          ]);
        setIndustries(industriesData);
        setSkills(skillsData);
        setCareerGoals(careerGoalsData);
        setMentoringFrequencies(frequencyData);
      } catch (err) {
        console.error("Error loading onboarding data:", err);
        setError("Failed to load your information. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getNamesByIds = (
    ids: number[],
    options: OnboardingOption[]
  ): string[] => {
    if (!ids.length || !options.length) return [];
    const optionMap = new Map(
      options.map((option) => [option.id, option.name])
    );
    return ids.map((id) => optionMap.get(id) || `Unknown (${id})`);
  };

  const professionalIndustriesNames = getNamesByIds(
    onboardingData.professionalBackground.industries,
    industries
  );
  const professionalSkillsNames = getNamesByIds(
    onboardingData.professionalBackground.skills,
    skills
  );
  const mentoringIndustriesNames = getNamesByIds(
    onboardingData.mentoringPreferences.industries,
    industries
  );
  const mentoringSkillsNames = getNamesByIds(
    onboardingData.mentoringPreferences.skills,
    skills
  );

  // Get career goal names from IDs
  const careerGoalNames = getNamesByIds(
    onboardingData.careerGoals.shortTermGoals,
    careerGoals
  );

  // Get mentoring frequency names from IDs
  const mentoringFrequencyNames = getNamesByIds(
    onboardingData.mentoringPreferences.frequency,
    mentoringFrequencies
  );

  const handleEdit = (stepNumber: number) => {
    handleEditStep?.(stepNumber);
  };

  const handleSubmit = async () => {
    if (!agreeToCodeOfConduct) {
      toast.error("Please agree to the Code of Conduct to continue");
      return;
    }

    if (!accessToken) {
      toast.error("Authentication required. Please log in again.");
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await submitOnboardingInformation(
        onboardingData,
        true, // code_of_conduct_accepted (since they checked the box)
        accessToken
      );

      // Update the user profile in the auth store with the returned data
      if (result.userProfile) {
        updateUser(result.userProfile);
      }

      toast.success("Profile completed successfully!");
      router.push("/onboarding/post");
    } catch (error) {
      handleErrorMessage(
        error,
        "Failed to complete profile. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const showCareerGoals = userType === "mentee";
  const showMentoringPreferences =
    userType === "mentee" || userType === "mentor";

  const getStepNumber = (section: string): number => {
    switch (section) {
      case "professionalBackground":
        return 1;
      case "careerGoals":
        return userType === "mentee" ? 2 : -1;
      case "mentoringPreferences":
        if (userType === "mentee") return 3;
        if (userType === "mentor") return 2;
        return -1;
      default:
        return -1;
    }
  };

  const InfoItem = ({
    label,
    value,
  }: {
    label: string;
    value: string | string[];
  }) => (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      {Array.isArray(value) ? (
        <div className="flex flex-wrap gap-2">
          {value.length > 0 ? (
            value.map((item, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {item}
              </Badge>
            ))
          ) : (
            <span className="text-sm text-muted-foreground italic">
              Not selected
            </span>
          )}
        </div>
      ) : (
        <span className="text-sm">{value || "Not provided"}</span>
      )}
    </div>
  );

  const ReviewCard = ({
    title,
    stepNumber,
    children,
  }: {
    title: string;
    stepNumber: number;
    children: React.ReactNode;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleEdit(stepNumber)}
          className="h-8 gap-1 text-primary hover:text-primary/80"
        >
          <Edit className="h-4 w-4" />
          Edit
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <Skeleton className="h-8 w-64 mx-auto" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="space-y-2">
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription className="flex items-center justify-between">
          {error}
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="text-center space-y-3">
        <div className="flex justify-center">
          <CheckCircle2 className="h-12 w-12 text-green-500" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight">
          Review Your Information
        </h2>
        <p className="text-muted-foreground text-lg">
          Please review all your information before completing your profile
        </p>
      </div>

      <div className="space-y-6">
        {/* Professional Background */}
        <ReviewCard
          title="Professional Background"
          stepNumber={getStepNumber("professionalBackground")}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoItem
              label="Current Role"
              value={onboardingData.professionalBackground.currentRole}
            />
            <InfoItem
              label="Company"
              value={onboardingData.professionalBackground.company}
            />
            <InfoItem label="Industries" value={professionalIndustriesNames} />
            <InfoItem label="Skills" value={professionalSkillsNames} />
            <InfoItem
              label="Years of Experience"
              value={onboardingData.professionalBackground.yearsOfExperience}
            />
          </div>
        </ReviewCard>

        {/* Career Goals */}
        {showCareerGoals && (
          <ReviewCard
            title="Career Goals"
            stepNumber={getStepNumber("careerGoals")}
          >
            <div className="space-y-4">
              <InfoItem
                label="Short Term Goals"
                value={careerGoalNames} // Now displays names instead of IDs
              />
              <InfoItem
                label="Long Term Goal"
                value={onboardingData.careerGoals.longTermGoal}
              />
            </div>
          </ReviewCard>
        )}

        {/* Mentoring Preferences */}
        {showMentoringPreferences && (
          <ReviewCard
            title={
              userType === "mentee"
                ? "Mentor Preferences"
                : "Mentoring Preferences"
            }
            stepNumber={getStepNumber("mentoringPreferences")}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoItem
                label="Frequency"
                value={mentoringFrequencyNames} // Now displays names instead of IDs
              />
              <InfoItem
                label="Language"
                value={onboardingData.mentoringPreferences.language}
              />
              <InfoItem label="Skills" value={mentoringSkillsNames} />
              <InfoItem label="Industries" value={mentoringIndustriesNames} />
            </div>
          </ReviewCard>
        )}

        {/* Code of Conduct Agreement */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="code-of-conduct"
                checked={agreeToCodeOfConduct}
                onCheckedChange={(checked) =>
                  setAgreeToCodeOfConduct(checked as boolean)
                }
                className="mt-1 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
              />
              <div className="space-y-2">
                <label
                  htmlFor="code-of-conduct"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  I agree to the Code of Conduct
                </label>
                <p className="text-sm text-muted-foreground">
                  By checking this box, I agree to abide by the platform&apos;s
                  Code of Conduct, which includes treating all members with
                  respect, maintaining confidentiality, and engaging in
                  professional and constructive interactions. I understand that
                  violations may result in account suspension or termination.
                </p>
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <FileText className="h-4 w-4" />
                  <button
                    type="button"
                    className="hover:underline font-medium"
                    onClick={() => {
                      // Open code of conduct in new tab or modal
                      window.open("/code-of-conduct", "_blank");
                    }}
                  >
                    Read full Code of Conduct
                  </button>
                </div>
              </div>
            </div>
            {!agreeToCodeOfConduct && (
              <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
                You must agree to the Code of Conduct to complete your profile
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-end pt-6">
        <Button
          variant="outline"
          onClick={handlePrevious}
          className="h-12 gap-2 w-[153px]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!agreeToCodeOfConduct || isSubmitting}
          className="w-[153px] bg-[#334AFF] hover:bg-[#251F99] h-12 gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            "Submitting..."
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Complete Profile
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default Review;
