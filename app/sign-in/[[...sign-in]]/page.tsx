import { SignIn } from "@clerk/nextjs"

import { AuthLayout } from "@/layouts/auth-layout"

export default function SignInPage() {
  return (
    <AuthLayout>
      <SignIn />
    </AuthLayout>
  )
}
