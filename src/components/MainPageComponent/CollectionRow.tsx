import React from 'react'
import { CollectionDisplay } from './CollectionDisplay'
import { CollectionHeader } from './CollectionHeader'
import { CollectionTitle } from './CollectionTitle'

interface CollectionRowProps {
        name: string,
        description?: string,
        playlists: any,
        id: string | null
}

export const CollectionRow = React.forwardRef<HTMLDivElement, CollectionRowProps>(({name, playlists, id, description}, ref) => {
        return (
                <div className="CollectionRow">
                        <CollectionTitle title={name} id={id} description={description}/>
                        <CollectionDisplay ref={ref} playlists={playlists}/>
                </div>
        )
})
    