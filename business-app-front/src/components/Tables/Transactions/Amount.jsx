
const Amount = ({ type, amount }) => {
  if (type === 1) {
    return <strong className='red'>{amount}</strong>;
  }

  return <strong className='green'>{amount}</strong>;
};

export default Amount;
