import {createContext} from 'react';

interface image {
    height: number | null,
    url: string,
    width: number | null
}

export interface userContext {
    country: string,
    display_name: string,
    email: string,
    external_urls: {
        spotify: string,
    },
    followers: {
        href: string | null,
        total: number
    },
    href: string,
    id: string,
    images: image[],
    product: string,
    type: string,
    uri: string
}

export const USER_CONTEXT_DEFAULT = {
    country: "",
    display_name: "",
    email: "",
    external_urls: {
        spotify: "",
    },
    followers: {
        href: null,
        total: 0
    },
    href: "",
    id: "",
    images: [],
    product: "",
    type: "",
    uri: ""
};

export const LoginContext = createContext(false)
export const UserContext = createContext<userContext>(USER_CONTEXT_DEFAULT)