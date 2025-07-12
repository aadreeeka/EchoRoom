import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
} from "../lib/api";
import { Link } from "react-router";
import { CheckCircleIcon, MapPinIcon, UserPlusIcon, UsersIcon } from "lucide-react";
import { motion } from "framer-motion";

import FriendCard from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";

const HomePage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] }),
  });

 useEffect(() => {
  const outgoingIds = new Set();
  if (Array.isArray(outgoingFriendReqs)) {
    outgoingFriendReqs.forEach((req) => {
      if (req?.recipient?._id) {
        outgoingIds.add(req.recipient._id);
      } else {
        console.warn("Invalid recipient in outgoingFriendReqs:", req);
      }
    });
    setOutgoingRequestsIds(outgoingIds);
  }
}, [outgoingFriendReqs]);

  return (
    <div className="p-2 sm:p-3 md:p-4" data-theme="lemonade">
      <div className="container mx-auto space-y-6">
        {/* Friends Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h2 className="text-lg sm:text-xl font-bold">Your Friends</h2>
          <Link to="/notifications" className="btn btn-outline btn-xs sm:btn-sm">
            <UsersIcon className="mr-1 size-3" />
            Friend Requests
          </Link>
        </div>

        {loadingFriends ? (
          <div className="flex justify-center py-6">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {friends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}

        {/* Recommendations */}
        <section className="mt-6">
          <div className="mb-4">
            <h2 className="text-lg sm:text-xl font-bold">Meet New Friends</h2>
            <p className="text-sm opacity-70">Find people who vibe with your interests</p>
          </div>

          {loadingUsers ? (
            <div className="flex justify-center py-8">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="card bg-base-200 p-4 text-center text-sm">
              <h3 className="font-semibold text-base mb-1">No recommendations available</h3>
              <p className="opacity-70">Check back later for new connections!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {recommendedUsers.map((user) => {
                const hasRequestBeenSent = outgoingRequestsIds.has(user._id);

                return (
                  <motion.div
                    key={user._id}
                    className="card bg-base-200 hover:shadow-lg transition-all w-full max-w-[280px] mx-auto"
                    whileTap={{ scale: 0.92 }}
                    whileHover={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 900, damping: 20, duration: 0.1 }}
                  >
                    <div className="card-body p-2 space-y-0.8">
                      {/* Avatar + Name */}
                      <div className="flex items-center gap-2">
                        <div className="avatar size-10 rounded-full">
                          <img src={user.profilePic} alt={user.fullName} />
                        </div>

                        <div>
                          <h3 className="font-semibold text-sm">{user.fullName}</h3>
                          {user.location && (
                            <div className="flex items-center text-xs opacity-70">
                              <MapPinIcon className="size-3 mr-1" />
                              {user.location}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Book + Hobby */}
                      <div className="flex flex-col gap-3 text-xs">
                         {user.bio && (
                          <blockquote className="text-xs font-semibold italic text-pink-900 border-l-4 border-pink-900 pl-1">
                            {user.bio}
                          </blockquote>
                      )}
                        {user.currentBook && (
                          <span className="badge badge-secondary py-5 text-sm">
                            📚Reading: {user.currentBook}
                          </span>
                        )}
                        {user.interests && (
                          <span className="badge badge-secondary py-4">
                            ✨Hobby: {user.interests}
                          </span>
                        )}
                      </div>

                      

                      {/* Friend Button */}
                      <button
                        className={`btn btn-xs w-full mt-1 ${
                          hasRequestBeenSent ? "btn-disabled" : "btn-primary"
                        }`}
                        onClick={() => sendRequestMutation(user._id)}
                        disabled={hasRequestBeenSent || isPending}
                      >
                        {hasRequestBeenSent ? (
                          <>
                            <CheckCircleIcon className="size-3 mr-1" />
                            Request Sent
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="size-3 mr-1" />
                            Add Friend
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
