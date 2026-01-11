export function Footer() {
  return (
    <footer className='w-full flex justify-center px-4 py-10 mt-10'>
      <div className='max-w-[700px] w-full flex justify-center'>
        <a
          className='text-sm text-[var(--color-text-tertiary)] hover:text-[var(--color-accent-primary)] transition-colors'
          href='https://github.com/davidclimbing'
        >
          ©Davidclimbing
        </a>
      </div>
    </footer>
  );
}
