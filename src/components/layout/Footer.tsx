export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Employee Manager. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
