import React from 'react'

type param = {
    access_token: string
}

export function getHashParams() {
    let hashParams = {} as param;
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
      hashParams[e[1] as keyof param] = decodeURIComponent(e[2]);
      e = r.exec(q);
    }
    return hashParams;
}