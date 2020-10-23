import React, { useContext, useState } from 'react'
import {UserContext} from '../../utilities/context'

interface UserInfoProps {

}

const UserInfo: React.FC<UserInfoProps> = ({}) => {
    const [open, setOpen] = useState(false);
    const {images, display_name, id} = useContext(UserContext);
    let img_url;
    if (images.length > 0) {
        img_url = images[0].url
    }

    return (
        <div style={divStyle}>
            <button className='UserInfoButton no-outline' onClick={() => setOpen(!open)}>
                <figure style={figureStyle}>
                    <img loading='eager' src={img_url} style={imgStyle} alt=''></img>
                </figure>
                <span className='UserInfoSpan mediaNoneXL'>
                    {display_name}
                </span>
                <span style={spanStyle} className='mediaNoneXL'> 
                    {open? <p>&#9650;</p>:<p>&#9660;</p>}
                </span>
            </button>
            <ul className='UserInfoOptions' style={{display: open?'block':'none'}}>
                <li>
                    <a href="https://www.spotify.com/account/?utm_source=play&amp;utm_campaign=wwwredirect" target="_blank" rel="noopener noreferrer">Account</a>
                </li>
                <li>
                    <a href={`/user/${id}`}>Profile</a>
                </li>
                <li>
                    <button>Log out</button>
                </li>
            </ul>
        </div>
    );
}

//type check does not let like this so this is a temp fix, i guess
const divStyle = {
    position: "relative" as "relative",
    whiteSpace: "nowrap" as "nowrap"
}

const figureStyle = {
    width: '28px' as '28px',
    height: '28px' as '28px',
    overflow: 'hidden' as 'hidden',
    position: 'relative' as 'relative',
    display: 'inline-block' as 'inline-block'
}

const imgStyle = {
    borderRadius: '50%' as '50%',
    width: '100%' as '100%',
    height: '100%' as '100%',
    objectFit: 'cover' as 'cover',
    objectPosition: 'center center' as 'center center'
}


const spanStyle = {
    marginRight: '6px' as '6px',
    marginLeft: '8px' as '8px',
    fontSize: '10px' as '10px'
}

export default UserInfo;