import React, { useContext } from 'react';
import ReactToolTip from 'react-tooltip';
import { LoginContext } from '../../utilities/context';
import { generateContent } from '../../utilities/tipContent';

interface NavListProps {

}

const NavList: React.FC<NavListProps> = ({children}) => {
    const loggedIn = useContext(LoginContext);
    return (
        <>
            <ul className="nav-list">
                {children}
            </ul>
            <ReactToolTip className='toolTip' id='tooltip' disable={loggedIn} place='right' effect='solid' globalEventOff='click' backgroundColor= '#2e77d0' getContent={dataTip => generateContent(dataTip)} clickable={true}/>
        </>
        
    );
}

export default NavList;