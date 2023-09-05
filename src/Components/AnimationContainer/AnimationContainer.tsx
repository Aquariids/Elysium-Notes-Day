import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';
import React, { ReactNode, useEffect, useState } from 'react';

interface IAnimationContainer {
    children:ReactNode
}


const AnimationContainer = ({children}:IAnimationContainer):JSX.Element => {
    const [animationOne, setAnimationOne] = useState(true);

useEffect(() => {
    setAnimationOne(true)
    setTimeout(() => {
        setAnimationOne(false)
    }, 1000)
},[])
    const router = useRouter();
    return (
        <>
        {animationOne ? <AnimatePresence>
            <motion.div
                transition={{ type: "spring", stiffness: 85 }}
                key={router.asPath}
                initial={{ x: router.asPath === '/' ? 15 : 0 , opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                id="page-transition-container"
            >
                {children}
            </motion.div>
        </AnimatePresence>: <> {children} </>}
        </>
    );
};

export default AnimationContainer;