import { SignIn } from "@clerk/clerk-react";

export default function AdminSignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Sign In
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to access admin features
          </p>
        </div>
        <SignIn
          appearance={{
            elements: {
              rootBox: "mx-auto w-full",
              card: "rounded-lg shadow-md",
            },
          }}
          signUpUrl="/admin/sign-up"
          afterSignInUrl="/settings"
          afterSignUpUrl="/settings"
        />
      </div>
    </div>
  );
}
