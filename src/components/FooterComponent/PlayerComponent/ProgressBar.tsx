import React, { useEffect, useRef, useState } from 'react'

interface ProgressBarProps {
    extraClass: string,
    value: number,
    engageClass: string,
    setValue?(ratio: number): void,
    scrubFunction?(ratio: number): void 
}

export const ProgressBar: React.FC<ProgressBarProps> = ({extraClass, value, engageClass, setValue, scrubFunction}) => {
    const [engage, setEngage] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const [scrub, setScrub] = useState(0)

    const wrapperRef = useRef<HTMLDivElement>(null)


    useEffect(() => {
        window.addEventListener('mousemove', handleMove)
        window.addEventListener('mouseup', handleMouseUp)
        
        return () => {
            window.removeEventListener('mousemove', handleMove)
            window.removeEventListener('mouseup', handleMouseUp)
        }
    })

    const handleMouseUp = (e: MouseEvent) => {
        const target = e.target as Element;
        setIsDragging(false)
        if (engage && setValue){
            setValue(scrub)
        }
        setScrub(0)
        if (!(e.currentTarget instanceof HTMLButtonElement)) {
            return;
        }
        
        if (e.target && 
            !target.classList.contains('progress-wrapper') &&
            !target.classList.contains('progress-bar') &&
            !target.classList.contains('progress') &&
            !target.classList.contains('progress-slider') ){
            setEngage(false)
        }
    }

    const handleMove = (e: MouseEvent) => {
        if (engage && isDragging && wrapperRef.current) {
            const rect = wrapperRef.current.getBoundingClientRect()
            let offsetRatio = (e.pageX - rect.x)/rect.width

            if (offsetRatio < 0){
                offsetRatio = 0.001 
            } else if (offsetRatio > 1){
                offsetRatio = 1
            }
            
            if(scrubFunction){
                scrubFunction(offsetRatio)
            }
            setScrub(offsetRatio)
        }
    }

    const handleEnter = () => {
        setEngage(true)
    }

    const handleLeave = () => {
        if (!isDragging){
            setEngage(false)
        }
    }

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setIsDragging(true);
        if (wrapperRef.current) {
            
            const rect = wrapperRef.current.getBoundingClientRect();
            const offsetRatio = (e.pageX - rect.x)/rect.width;
            console.log(offsetRatio);
            setScrub(offsetRatio)
        }
        
    }

    return (
        <div ref={wrapperRef} className="progress-wrapper" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onMouseDown={handleMouseDown}>
            <div className={`progress-bar`} >
                {/* {console.log(((1-(scrub || value))*100).toFixed(1))} */}
                <div className={`progress ${extraClass} ${engage? engageClass:''}`} style={{transform: `translate(-${((1-(scrub || value))*100).toFixed(2)}%)`}} ></div>
            </div>
            <button className={`progress-slider ${extraClass} no-outline ${engage? engageClass:''}`} style={{left: `${((scrub || value)*100).toFixed(2)}%`}} ></button>
        </div>
    );
}