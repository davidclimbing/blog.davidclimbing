import Link from 'next/link';

export const Header = () => {
  return (
    <header className='w-full sticky top-0 left-0 right-0 z-[200] px-5 py-4 flex justify-center backdrop-blur-md'>
      <div className='max-w-[700px] w-full flex items-center'>
        <Link className='mr-auto' href='/'>
          <h1 className='text-xl font-bold'>DavidClimbing</h1>
        </Link>
        <div className='flex flex-row items-center gap-2'>
          <a className='text-base' href='https://playground.davidclimbing.com'>
            Playground
          </a>
          <a className='text-base' href='https://github.com/davidclimbing'>
            github
          </a>
        </div>
      </div>
    </header>
  );
};
