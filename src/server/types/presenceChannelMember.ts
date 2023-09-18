type PresenceChannelMember = {
  id: string;
  info: {
    username: string;
    image: string | null;
    bio: string | null;
  };
};

export default PresenceChannelMember;
