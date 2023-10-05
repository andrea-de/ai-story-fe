"use client"

import Api from "@/app/helper/api";
import React, { useEffect, useRef, useState } from 'react';
import { redirect, useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from "next/link";


const api = new Api();

export default function Page() {

    const params = useParams();
    const tag = params.story;
    if (!tag) redirect('/');
    else redirect(`/stories/${tag}/0`);
}