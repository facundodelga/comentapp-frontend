import { LoginForm } from '@/components/login-form'
import { BadgeDollarSign } from 'lucide-react'
const LoginPage = () => {
    return (
        <>
            <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
                <div className="flex w-full max-w-sm flex-col gap-6">
                    <a href="#" className="flex items-center gap-2 self-center font-medium">
                        <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                            <BadgeDollarSign className="h-5 w-5" />
                        </div>
                        ComentApp
                    </a>
                    <LoginForm />
                </div>
            </div>
        </>
    )
}

export default LoginPage