import React, { CSSProperties } from 'react'
import Icon from '../../icons';
import { userContext } from '../../utilities/context';

interface PageBannerProps {
    title: string,
    bannerInfo: { 
        name: string; 
        description: string; 
        user: userContext[]; 
        followers: {total: number}; 
        primary_color: string; 
        images: { url: string; }[]; 
        release_date?: string, 
        total?: number
    },
    totalTracks: number
}

function followerTitle(title: string){
    switch (title) {
        case 'profile':
            return 'Followers'
        case 'artist':
            return 'monthly listeners'
        default:
            return 'Likes'
    }
}

const followerStyle ={
    fontSize: '16px',
    lineHeight: '2',
    marginTop: '4px',
    color: '#fff'
} as CSSProperties;

const spanStyle = {
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    marginTop: '4px',
    wordBreak: 'break-word',
    overflow: 'hidden',
} as CSSProperties;

export const PageBanner: React.FC<PageBannerProps> = ({title, bannerInfo, totalTracks}) => {
    const {name, description, user, followers, primary_color, images, release_date, total} = bannerInfo;
    let imgUrl, likes;

    if (images && images.length > 0){
        imgUrl = images[0].url
    }

    if (followers){
        likes = followers.total.toLocaleString('en-US');
    }
    return (
        <div className="banner" style={{backgroundColor:`${primary_color}`, height: title === 'artist'?'40vh':'30vh'}}>
            <div className={`bannerImgDiv ${title==='profile'||title==='artist'? 'circleDiv':null}`}>
                {imgUrl ? 
                    <img loading="lazy" src={imgUrl} className={`bannerImg ${title==='profile'||title==='artist'? 'circleDiv':null}`} alt="" />:
                    <div className="svgSizing">
                        <Icon name='Music2'/>
                    </div>
                }
            </div>

            <div className="bannerInfo">
                <h2 className="pageTitle">{title}</h2>
                <span style={spanStyle}>
                    <h1 className={name.length > 15? "bannerTitleXL":"bannerTitle"}>{name}</h1>
                </span>
                <p className="bannerDescription" style={{display: description===''? 'none':'flex'}}>{description}</p>
                <div className="additionalInfo">
                    {user && user[0] && user.map((person:any , index:number) => (
                        <>
                            {person.images[0] 
                                ? <img style={{borderRadius: '50%', width:'25px'}} src={person.images[0].url}></img>
                                : <></>
                            }
                            <a key={index} href={`/${person.type}/${person.id}`} style={{content: 'none'}}>{person.type === 'artist'? person.name:person.display_name}</a>
                            <p>{totalTracks} songs</p>
                        </>
                    ))}
                    {total !== 0 && total&& 
                        <h2>{total} Playlists</h2>
                    }
                    {followers.total !== 0 &&
                        <h2 style={title === 'artist' ? followerStyle : undefined}>{likes} {followerTitle(title)}</h2>
                    }
                    {release_date && 
                        <h2>{release_date}</h2>
                    }
                </div>
            </div>
            <div className="bannerOverlay"></div>
        </div>
    );
}