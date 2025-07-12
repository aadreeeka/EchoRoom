import { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { completeOnboarding } from "../lib/api";
import {
  LoaderIcon,
  MapPinIcon,
  GemIcon,
  ShuffleIcon,
  CameraIcon,
  BookIcon,
  SparklesIcon,
} from "lucide-react";
import { BOOKS, HOBBIES, SHOWS } from "../constants";
import { motion } from "framer-motion";

const OnboardingPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
    currentBook: authUser?.currentBook || "",
    currentShow: authUser?.currentShow || "",
    interests: authUser?.interests || "",
  });

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Profile onboarded successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onboardingMutation(formState);
  };

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
    setFormState({ ...formState, profilePic: randomAvatar });
    toast.success("Random profile picture generated!");
  };

  return (
    <div data-theme="lemonade" className="min-h-screen bg-base-100 flex items-center justify-center p-2 relative">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
        <div className="absolute w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse top-20 left-10"></div>
        <div className="absolute w-72 h-72 bg-secondary rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse top-40 right-10"></div>
      </div>

      <motion.div 
        className="card bg-base-200 w-full max-w-2xl shadow-xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="card-body p-4 sm:p-5">
          <h1 className="text-xl sm:text-2xl font-bold text-center mb-2 text-primary">
            Let the Echo Begin
          </h1>
          <p className="text-sm text-base-content opacity-60 text-center mb-4">
            Tell us a bit about yourself — someone out there is waiting to hear you.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* PROFILE PIC */}
            <div className="flex flex-col items-center justify-center space-y-1">
              <div className="size-32 rounded-full bg-base-300 overflow-hidden">
                {formState.profilePic ? (
                  <motion.img
                    key={formState.profilePic}
                    src={formState.profilePic}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <CameraIcon className="size-12 text-base-content opacity-40" />
                  </div>
                )}
              </div>
              <button 
                type="button" 
                onClick={handleRandomAvatar} 
                className="btn btn-secondary btn-sm px-2 text-sm w-fit transition-all hover:scale-105 active:scale-95"
              >
                <ShuffleIcon className="size-4 mr-1" />
                Generate Avatar
              </button>
            </div>

            {/* FULL NAME */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formState.fullName}
                onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                className="input input-bordered w-full text-sm"
                placeholder="Your full name"
              />
            </div>

            {/* BIO */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Bio</span>
              </label>
              <textarea
                name="bio"
                value={formState.bio}
                onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                className="textarea textarea-bordered h-24 text-sm"
                placeholder="Share your story"
              />
            </div>

            {/* LOCATION */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Location</span>
              </label>
              <div className="relative">
                <MapPinIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 size-4 text-base-content opacity-70" />
                <input
                  type="text"
                  name="location"
                  value={formState.location}
                  onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                  className="input input-bordered pl-8 text-sm"
                  placeholder="City, Country"
                />
              </div>
            </div>

            {/* CURRENTLY READING */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-1">
                  <BookIcon className="size-4" />
                  Currently Reading
                </span>
              </label>
              <select
                value={formState.currentBook}
                onChange={(e) => setFormState({ ...formState, currentBook: e.target.value })}
                className="select select-bordered text-sm"
              >
                <option value="">Select a book</option>
                {BOOKS.map((book) => (
                  <option key={book} value={book}>
                    {book}
                  </option>
                ))}
              </select>
            </div>

            {/* CURRENTLY WATCHING */}
<div className="form-control">
  <label className="label">
    <span className="label-text flex items-center gap-1">
      📺 Currently Watching
    </span>
  </label>
  <select
    value={formState.currentShow}
    onChange={(e) => setFormState({ ...formState, currentShow: e.target.value })}
    className="select select-bordered text-sm"
  >
    <option value="">Select a show</option>
    {SHOWS.map((show) => (
      <option key={show} value={show}>
        {show}
      </option>
    ))}
  </select>
</div>


            {/* HOBBIES */}
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-1">
                  <SparklesIcon className="size-4" />
                  Hobbies / Interests
                </span>
              </label>
              <select
                value={formState.interests}
                onChange={(e) => setFormState({ ...formState, interests: e.target.value })}
                className="select select-bordered text-sm"
              >
                <option value="">Select hobbies</option>
                {HOBBIES.map((hobby) => (
                  <option key={hobby} value={hobby}>
                    {hobby}
                  </option>
                ))}
              </select>
            </div>

            {/* SUBMIT BUTTON */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
              <button className="btn btn-secondary w-full mt-2" disabled={isPending} type="submit">
                {!isPending ? (
                  <>
                    <GemIcon className="size-5 mr-2" />
                    Complete Onboarding
                  </>
                ) : (
                  <>
                    <LoaderIcon className="animate-spin size-5 mr-2" />
                    Onboarding...
                  </>
                )}
              </button>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default OnboardingPage;


