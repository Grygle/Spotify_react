import React from 'react'
import useAuthorization from './useAuthorization';

export default function Dashboard({code}) {
    const accessToken = useAuthorization(code)
    return (
        <div>
            {code}
        </div>
    )
}
