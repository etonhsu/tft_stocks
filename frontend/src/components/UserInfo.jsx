/* eslint-disable react/prop-types */

const UserInfo = ({ username, balance }) => {
  if (balance === undefined) {
    return <p>Loading or no balance available...</p>;
  }

  return (
    <div>
      <h3>User: {username}</h3>
      <p>Balance: ${balance.toFixed(2)}</p>
    </div>
  );
};

export default UserInfo;