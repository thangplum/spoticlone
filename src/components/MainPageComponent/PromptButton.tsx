import React from 'react'

interface PromptButtonProps {
    to?: string,
    name: string,
    styleName: string,
    onClick?: any
}

function switchStyle(style: string){
    switch(style){
        case 'dark':
            return darkStyle
        case 'light':
            return lightStyle
        case 'CTA':
            return ctaStyle
        default:
            return undefined
    }
}

const darkStyle = {
    backgroundColor: 'transparent' as 'transparent',
    color: '#fff' as '#fff'
}


const lightStyle = {
    backgroundColor: '#fff' as '#fff',
    color: '#181818' as '#181818'
}


const ctaStyle ={
    margin: '8px 0 12px' as '8px 0 12px',
    whiteSpace: 'nowrap' as 'nowrap',
    fontSize: '14px' as '14px',
    color: '#2e77d0' as '#2e77d0',
    padding: '8px 48px' as '8px 48px'
}

export const PromptButton: React.FC<PromptButtonProps> = ({to, name, styleName, onClick}) => {
    return (
        to? 
        <a href={to}>
            <button className="PromptButton no-outline" name={name} style={switchStyle(styleName)} >{name}</button>
        </a>
            :
        <button className="PromptButton no-outline" name={name} style={switchStyle(styleName)} onClick={onClick}>{name}</button>
    )
}