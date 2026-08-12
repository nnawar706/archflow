import { SignUp } from "@clerk/nextjs"

import { AuthLayout } from "@/layouts/auth-layout"

export default function SignUpPage() {
  return (
    <AuthLayout>
      <SignUp />
    </AuthLayout>
  )
}
