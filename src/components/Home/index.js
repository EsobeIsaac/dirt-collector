import React, { useEffect }  from 'react';
import {Box, Button, Typography, } from '@mui/material';
import classes from './Home.module.css';
import video from '../../utils/video/trash.mp4'





function UserForm({user, startedFunc}) {

  useEffect(()=>{
    if(window.location.pathname !== '/') {
      window.location.pathname = '/'
    }
  }, [])

  return (
        <Box p={4} className={classes.home}>

          <video loop autoPlay={true} muted className={classes.video}>
            <source src={video} height={'100%'} />
          </video>

          <Box className={classes.overlay}>
            <Box mx={3}>
              <Typography variant='h4' gutterBottom>{
                !user ? 'Are you ready to take a proactive step towards a cleaner and more sustainable future?' : `Welcome Back ${user.name} !!!`
              }</Typography>
              <Typography>We are dedicated to providing responsible waste management solutions that reduce environmental impact and promote a healthier planet.</Typography>

              {
                user && <Typography>Thanks for being part of us.</Typography>
              }

              {
                !user && <Box sx={{
                  marginTop: '30px'
                }}>
                    <Button onClick={()=>{startedFunc()}} variant='contained' size='large'>Get Started</Button>
                </Box>
              }
              
            </Box>
          </Box>
                
          
        </Box>
  );
}


export default React.memo(UserForm)
