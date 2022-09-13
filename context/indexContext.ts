import React, { createContext }  from 'react';

export const indexContext = createContext({} as {
    innerData:  { title: string; text: string; }[];
    setInnerData: React.Dispatch<React.SetStateAction< { title: string; text: string; }[]>>;
});