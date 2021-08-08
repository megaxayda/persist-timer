export default function InputTime({ value, onChange }) {
  const handleFocus = (event) => event.target.select();

  return (
    <input
      type="number"
      value={value}
      onChange={onChange}
      onFocus={handleFocus}
    ></input>
  );
}
