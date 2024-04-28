interface UserData {
    username: string;
    balance: number;
}

interface UserInfoProps {
    userData: UserData
}

export const UserInfo: React.FC<UserInfoProps> = ({ userData}) => {
  if (userData.balance === undefined) {
    return <p>Loading or no balance available...</p>;
  }

  return (
    <div>
        <h3>User: {userData.username}</h3>
        <p>Balance: ${userData.balance.toFixed(2)}</p>
    </div>
  );
};
