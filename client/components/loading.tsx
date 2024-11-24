import React from 'react'

export default function loading() {
    return (
        <div className="flex w-full h-screen justify-center items-center bg-gray/40">
            <div className="flex w-96 items-center justify-between">
                <div className="loader"></div>
                <div className="loader2">Load&nbsp;ng</div>
            </div>
        </div>

    )
}
