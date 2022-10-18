import React, { useState,useContext, useEffect } from 'react';
import mockUser from './mockData.js/mockUser';
import mockRepos from './mockData.js/mockRepos';
import mockFollowers from './mockData.js/mockFollowers';
import axios from 'axios';

const rootUrl = 'https://api.github.com';

const GithubContext = React.createContext();

const GithubProvider = ({children}) =>{
    const [githubUser,setGithubUser ] = useState(mockUser)
    const [repos,setRepos] = useState(mockRepos)
    const [followers,setFollowers] = useState(mockFollowers)

    const [request,setRequest] = useState(0)
    const [loading,setLoading] = useState(false)
    const [error,setError] = useState({show:false,msg:''})

    const checkRequest = () =>{
        axios(`${rootUrl}/rate_limit`).then(({data})=>{
            let {rate:{remaining}} = data
            setRequest(remaining)
            if(remaining===0){
                toggleError(true,"sorry,you have exceed your hourly rate limit");
            }
         }).catch((err)=>console.log(err))
    }

    const getUser = async(user) =>{
        toggleError()
        setLoading(true)
        const response = await axios(`${rootUrl}/users/${user}`).catch((err)=>console.log(err))
        if(response){
            setGithubUser(response.data)
            const {login,followers_url} = response.data
            await Promise.allSettled([
                axios(`${rootUrl}/users/${login}/repos?per_page=100`),
                axios(`${followers_url}?per_page=100`)
            ]).then((results) => {
                const [repos,followers] = results;
                if(repos.status === 'fulfilled'){
                    setRepos(repos.value.data)
                }
                if(followers.status === 'fulfilled'){
                    setFollowers(followers.value.data)
                }
            })
                
            // const reposData = await axios(`${rootUrl}/users/${login}/repos?per_page=100`)
            // setRepos(reposData.data)
            // const followersData = await axios(`${followers_url}?per_page=100`)
            // setFollowers(followersData.data)
        }else{
            toggleError(true,'there is no user with that username')
        }
        checkRequest()
        setLoading(false)
    }

    const toggleError = (show=false,msg='') =>{
        setError({show:show,msg:msg});
    }
    useEffect(checkRequest,[])

    return (
        <GithubContext.Provider value={{githubUser,repos,followers,request,error,getUser,loading}}>{children}</GithubContext.Provider>
    )
}

export const useGlobelContext = ()=>{
    return useContext(GithubContext)
}

export {GithubContext,GithubProvider}
