import Logo from "./logo";

export default function Footer() {
  return (
    <footer>
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-8 md:py-12">
          <div className="text-center">
            <div className="mb-3">
              <Logo />
            </div>
            <div className="text-sm">
              <p className="text-indigo-200/65">
                © Sebastian Lobentanzer
                <span className="text-gray-700"> · </span>
                <a
                  href="https://slobentanzer.github.io"
                  className="hover:text-indigo-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  slobentanzer.github.io
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
