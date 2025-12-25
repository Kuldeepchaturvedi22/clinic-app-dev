// import { createContext, useContext, useMemo, useState } from 'react'
// import api from '../api/client'
//
// type AuthCtx = {
//     token: string | null
//     role: 'PATIENT' | 'DOCTOR' | 'ADMIN' | null
//     userName: string | null
//     login: (email: string, password: string) => Promise<'PATIENT' | 'DOCTOR' | 'ADMIN'>
//     logout: () => void
//     registerPatient: (data: {
//         email: string
//         password: string
//         fullName: string
//         phone: string
//         dateOfBirth: string
//         gender?: string
//     }) => Promise<{ message: string; userId: number }>
//     registerDoctor: (data: {
//         email: string
//         password: string
//         fullName: string
//         phone: string
//         specialization: string
//     }) => Promise<{ message: string; userId: number }>
// }
//
// const Ctx = createContext<AuthCtx | undefined>(undefined)
//
// export function AuthProvider({ children }: { children: React.ReactNode }) {
//     const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
//     const [role, setRole] = useState<'PATIENT' | 'DOCTOR' | 'ADMIN' | null>(
//         (localStorage.getItem('role') as 'PATIENT' | 'DOCTOR' | 'ADMIN' | null) ?? null
//     )
//     const [userName, setUserName] = useState<string | null>(localStorage.getItem('userName'))
//
//     const login = async (email: string, password: string) => {
//         const res = await api.post('/auth/login', { email, password })
//         const { token: t, role: r } = res.data as { token: string; role: 'PATIENT'|'DOCTOR'|'ADMIN'; userId: number|null }
//         localStorage.setItem('token', t)
//         localStorage.setItem('role', r)
//         setToken(t)
//         setRole(r)
//
//         // Fetch user name after login (skip for admin)
//         if (r !== 'ADMIN') {
//             try {
//                 const profileRes = await api.get(r === 'PATIENT' ? '/patients/me' : '/doctors/me')
//                 const name = profileRes.data.fullName
//                 localStorage.setItem('userName', name)
//                 setUserName(name)
//             } catch {
//                 // Ignore if profile fetch fails
//             }
//         } else {
//             localStorage.setItem('userName', 'Admin')
//             setUserName('Admin')
//         }
//
//         return r // Return role for redirect logic
//     }
//
//     const logout = () => {
//         localStorage.removeItem('token')
//         localStorage.removeItem('role')
//         localStorage.removeItem('userName')
//         setToken(null)
//         setRole(null)
//         setUserName(null)
//     }
//
//     const registerPatient: AuthCtx['registerPatient'] = async (data) => {
//         const res = await api.post('/auth/register-patient', data)
//         return res.data as { message: string; userId: number }
//     }
//
//     const registerDoctor: AuthCtx['registerDoctor'] = async (data) => {
//         const res = await api.post('/auth/register-doctor', data)
//         return res.data as { message: string; userId: number }
//     }
//
//     const value = useMemo(() => ({ token, role, userName, login, logout, registerPatient, registerDoctor }), [token, role, userName])
//
//     return <Ctx.Provider value={value}>{children}</Ctx.Provider>
// }
//
// // eslint-disable-next-line react-refresh/only-export-components
// export function useAuth() {
//     const ctx = useContext(Ctx)
//     if (!ctx) throw new Error('useAuth must be used within AuthProvider')
//     return ctx
// }

import { createContext, useContext, useMemo, useState, useCallback } from 'react'
import api from '../api/client'

// ... (AuthCtx type definition stays the same) ...
type AuthCtx = {
    token: string | null
    role: 'PATIENT' | 'DOCTOR' | 'ADMIN' | null
    userName: string | null
    login: (email: string, password: string) => Promise<'PATIENT' | 'DOCTOR' | 'ADMIN'>
    logout: () => void
    registerPatient: (data: {
        email: string
        password: string
        fullName: string
        phone: string
        dateOfBirth: string
        gender?: string
    }) => Promise<{ message: string; userId: number }>
    registerDoctor: (data: {
        email: string
        password: string
        fullName: string
        phone: string
        specialization: string
    }) => Promise<{ message: string; userId: number }>
}

const Ctx = createContext<AuthCtx | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
    const [role, setRole] = useState<'PATIENT' | 'DOCTOR' | 'ADMIN' | null>(
        (localStorage.getItem('role') as 'PATIENT' | 'DOCTOR' | 'ADMIN' | null) ?? null
    )
    const [userName, setUserName] = useState<string | null>(localStorage.getItem('userName'))

    // 1. Wrap functions in useCallback to stabilize their reference
    const login = useCallback(async (email: string, password: string) => {
        const res = await api.post('/auth/login', { email, password })
        const { token: t, role: r } = res.data as { token: string; role: 'PATIENT'|'DOCTOR'|'ADMIN'; userId: number|null }

        localStorage.setItem('token', t)
        localStorage.setItem('role', r)
        setToken(t)
        setRole(r)

        if (r !== 'ADMIN') {
            try {
                const profileRes = await api.get(r === 'PATIENT' ? '/patients/me' : '/doctors/me')
                const name = profileRes.data.fullName
                localStorage.setItem('userName', name)
                setUserName(name)
            } catch {
                // Ignore errors
            }
        } else {
            localStorage.setItem('userName', 'Admin')
            setUserName('Admin')
        }

        return r
    }, []) // No dependencies needed as state setters are stable

    const logout = useCallback(() => {
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        localStorage.removeItem('userName')
        setToken(null)
        setRole(null)
        setUserName(null)
    }, [])

    const registerPatient: AuthCtx['registerPatient'] = useCallback(async (data) => {
        const res = await api.post('/auth/register-patient', data)
        return res.data as { message: string; userId: number }
    }, [])

    const registerDoctor: AuthCtx['registerDoctor'] = useCallback(async (data) => {
        const res = await api.post('/auth/register-doctor', data)
        return res.data as { message: string; userId: number }
    }, [])

    // 2. Now add the functions to the dependency array
    const value = useMemo(() => ({
        token,
        role,
        userName,
        login,
        logout,
        registerPatient,
        registerDoctor
    }), [token, role, userName, login, logout, registerPatient, registerDoctor])

    return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const ctx = useContext(Ctx)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}