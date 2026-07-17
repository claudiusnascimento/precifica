export interface AuthUser {
    id: number;
    name: string;
    email: string;
    role: string;
}

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export interface LoginPayload {
    email: string;
    password: string;
    remember?: boolean;
}

export interface ForgotPasswordPayload {
    email: string;
}

export interface ResetPasswordPayload {
    email: string;
    token: string;
    password: string;
    password_confirmation: string;
}

export interface AuthResponse {
    message: string;
    user: AuthUser;
}

export interface UserResponse {
    user: AuthUser;
}

export interface MessageResponse {
    message: string;
}
