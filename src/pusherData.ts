// TODO: Abstract return type, generics...
export const Lobby = {
  name: "lobby",
  event: {
    //userJoined: "user_joined",
    roomMatched: "room_matched",
  },
};

export const RoomChannel = {
  name: (id: string) => "room-" + id,
  event: {
    subscriptionSucceeded: "pusher:subscription_succeeded",
    newMessage: "new_message",
    userTyped: "user_typed",
    memberRemoved: "pusher:member_removed",
  },
};
