import { useState } from "react";
import { GemIcon } from "lucide-react";
import { Link } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { motion } from "framer-motion";

const SignUpPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const queryClient = useQueryClient();
  const {
    mutate: signupMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post("/auth/signup", signupData);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  });

  const handleSignup = (e) => {
    e.preventDefault();
    signupMutation(signupData);
  };

  return (
    <div
      className="flex items-center justify-center py-10 px-4 sm:px-6 md:px-8 relative"
      data-theme="lemonade"
    >
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
        <div className="absolute w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse top-20 left-10"></div>
        <div className="absolute w-72 h-72 bg-secondary rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse top-40 right-10"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-3xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden"
      >
        {/* SIGNUP FORM */}
        <div className="w-full lg:w-1/2 p-4 sm:p-5 flex flex-col">
          <div className="mb-4 flex items-center justify-start gap-2">
            <GemIcon className="size-9 text-primary" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              EchoRoom
            </span>
          </div>

          {error && (
            <div className="alert alert-error mb-4">
              <span>{error.response.data.message}</span>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-3">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h2 className="text-xl font-semibold">Create an Account</h2>
              <p className="text-sm opacity-70">
                Join EchoRoom and start your language learning adventure!
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="input input-bordered w-full"
                value={signupData.fullName}
                onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                required
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="john@gmail.com"
                className="input input-bordered w-full"
                value={signupData.email}
                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                required
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="********"
                className="input input-bordered w-full"
                value={signupData.password}
                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                required
              />
              <p className="text-xs opacity-70 mt-1">
                Password must be at least 6 characters long
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="form-control">
              <label className="label cursor-pointer justify-start gap-2">
                <input type="checkbox" className="checkbox checkbox-sm" required />
                <span className="text-xs leading-tight">
                  I agree to the <span className="text-primary hover:underline">terms of service</span> and <span className="text-primary hover:underline">privacy policy</span>
                </span>
              </label>
            </motion.div>

            <motion.button
              type="submit"
              disabled={isPending}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn btn-primary w-full"
            >
              {isPending ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Loading...
                </>
              ) : (
                "Create Account"
              )}
            </motion.button>

            <div className="text-center mt-4">
              <p className="text-sm">
                Already have an account? {" "}
                <Link to="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* ILLUSTRATION */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-4">
            <div className="relative aspect-square max-w-sm mx-auto">
              <img src="/i.png" alt="Language connection illustration" className="w-full h-full" />
            </div>
            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold">Connect with language partners worldwide</h2>
              <p className="opacity-70">
                Practice conversations, make friends, and improve your language skills together
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpPage;

