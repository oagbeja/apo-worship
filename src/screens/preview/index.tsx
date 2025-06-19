import Presentation from "../presentation";

const Preview = () => {
  return (
    <div className='w-full h-full justify-center flex items-center'>
      <div className='relative overflow-hidden w-[300px] h-[300px] flex justify-center items-center'>
        <Presentation width='100%' height='100%' prose={false} />
      </div>
    </div>
  );
};

export default Preview;
