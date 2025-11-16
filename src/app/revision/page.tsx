"use client";
import {use, useEffect, useState} from 'react';


interface RevisionPageProps {
    name: string;
    age: number;
}
function Welcome(){
    return<h1>Hello, I'm component</h1>
}
function Counter(){
    const [count, setCount]= useState(0);
    useEffect(() => {
        console.log(`Count is now: ${count}`);
    },[count]);
    return(
        <div>
            <p>you clicked  {count} times</p>
            <button onClick={()=> setCount(count +1)}>Click me!</button>
        </div>
    );
}
export default function RevisionPage({name, age}: RevisionPageProps) {
    return(
        <div>
            <Welcome />
            <h1>hello {'darren'}, you are {35} years old.</h1>
            <Counter />
        </div>
    )
}
