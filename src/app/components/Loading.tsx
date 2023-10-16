import React from 'react'
import './loading.css'

interface LoadingProps {
    text?: string;
}

export default function Loading({ text = 'Loading' }: LoadingProps) {
    return (
        <span className="loading p-3 ">{text} </span>
    );
}