import { toast } from "react-toastify"
import { login } from "./spotify"
import type { Res } from "./types.spotify"
import React from "react"
import { Buffer } from "buffer"

const cache = new Map<string, string>()

const getFromLocal = (key: string) => {
    if(cache.has(key)) {
        return cache.get(key)
    }

    return window.localStorage.getItem(key)
}

export const setToLocal = (key: string, value: string) => {

    cache.set(key, value)

    return window.localStorage.setItem(key, value)
}

export const getCreds = () => {
    const clientId =  getFromLocal('clientId')
    const clientSecret = getFromLocal('clientSecret')

    if(!clientId || !clientSecret) {
        return null
    }

    return {
        clientId,
        clientSecret: Buffer.from(Buffer.from(clientSecret, 'hex').toString(), 'base64').toString('utf-8')
    }        
}

export const getToken = async (s: React.Dispatch<React.SetStateAction<boolean>>) => {
    const token = getFromLocal('token')
    const creds = getCreds()

    if(!creds) {
        s(false)
        toast.error('Please enter your credentials')
        return null
    } else {
        s(true)
    }

    if (!token) {
        const newToken = await login(creds.clientId, creds.clientSecret)
        return newToken
    }

    const { access_token, expires_in } = JSON.parse(token) as Res

    if (Date.now() > expires_in) {
        const newToken = await login(creds.clientId, creds.clientSecret)
        return newToken
    }

    return access_token

}