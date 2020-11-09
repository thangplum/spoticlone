import React from 'react'

interface FooterProps {

}

export const Footer: React.FC<FooterProps> = (props) => {
    return (
        <div className="footer">
            {props.children}
        </div>
    );
}