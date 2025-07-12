import { Link } from "react-router";

const FriendCard = ({ friend }) => {
  return (
    <div className="card bg-base-200 hover:shadow-md transition-shadow">
      <div className="card-body p-4">
        {/* USER INFO */}
        <div className="flex items-center gap-2 mb-1">
          <div className="avatar size-12 shrink-0">
            <img src={friend.profilePic} alt={friend.fullName} className="rounded-full object-cover w-full h-full" />
          </div>
          <h3 className="font-semibold truncate w-full">{friend.fullName}</h3>
        </div>

       {/* INFO BADGES */}
<div className="flex flex-col gap-1 text-sm mb-3">
    {friend.bio && (
    <div className="bg-base-300 rounded px-3 py-2 text-left max-w-full text-xs opacity-80">
      📝 <span className="font-medium">Bio:</span>{" "}
      <span className="ml-1 block truncate max-w-[180px] sm:max-w-[220px]">{friend.bio}</span>
    </div>
  )}
  {friend.currentBook && (
    <div className="badge badge-secondary px-3 py-2 max-w-full text-left break-words">
      📚 <span className="font-medium">Reading:</span>{" "}
      <span className="ml-1 truncate block max-w-[180px] sm:max-w-[200px]">
        {friend.currentBook}
      </span>
    </div>
  )}
  {friend.interests && (
    <div className="badge badge-outline px-3 py-2 max-w-full text-left break-words">
      ✨ <span className="font-medium">Hobby:</span>{" "}
      <span className="ml-1 truncate block max-w-[180px] sm:max-w-[200px]">
        {friend.interests}
      </span>
    </div>
  )}
</div>


        {/* MESSAGE BUTTON */}
        <Link to={`/chat/${friend._id}`} className="btn btn-outline w-full">
          Message
        </Link>
      </div>
    </div>
  );
};

export default FriendCard;

