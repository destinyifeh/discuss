export const AppProgressBar = ({item, max}: {item: number; max: number}) => {
  return (
    <div className="relative w-full h-2 bg-gray-200 rounded">
      <div
        className="absolute top-0 left-0 h-2 bg-[#0a66c2] rounded"
        style={{width: `${Math.min((item / max) * 100, 100)}%`}}
      />
    </div>
  );
};
