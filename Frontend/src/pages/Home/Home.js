import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios'


const Home = () => {

    // code below, to send request on click button

    const [isSending, setIsSending] = useState(false)
    const isMounted = useRef(true)

    // set isMounted to false when we unmount the component
    useEffect(() => {
        return () => {
            isMounted.current = false
        }
    }, [])

    const sendRequest = useCallback(async () => {
        // don't send again while we are sending
        if (isSending) return
        // update state
        setIsSending(true)
        // send the actual request
        await axios.get('https://europe-west3-twirrer-app.cloudfunctions.net/api/getAllPosts')
            .then((res) => {
            console.log("data", res.data)
            })
            .catch((err) => {
            console.log('error505', err)
        })
        // once the request is sent, update state again
        if (isMounted.current) // only update if we are still mounted
            setIsSending(false)
    }, [isSending]) // update the callback if the state changes

    return (
        <input type="button" disabled={isSending} onClick={sendRequest} value="send request"/>
    )
}
 
export default Home;
