import React, { useEffect, useState }  from 'react';
import axios from 'axios';
import {Box, Button, Stack, Typography, Paper, FormGroup, TextField, Link, FormHelperText, MenuItem} from '@mui/material';
import LocationSearching from '@mui/icons-material/LocationSearching';
import { DateTimePicker, TimePicker } from '@mui/x-date-pickers';
import {addDoc, doc, getDoc, setDoc, updateDoc} from 'firebase/firestore'
import NotPermited from '../NotPermited';




function UserForm({db, user, colRef, noUser}) {

  const [signInDetails, setSignInDetails] = useState({
    email: '',
    phone: '',
    name: '',
    address: '',
    day: null,
    time: '',
    user: null
  });

  
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  const valueChange = (fieldName, fieldValue) => {
    
    setSignInDetails((prevProps)=> {
      Object.keys(prevProps).forEach(item=>{
        if(item === fieldName) {
          prevProps[item] = fieldValue;
        }
      })
      return {
        ...prevProps,
      }
    })

  }

  const docRef = user ? doc(db, 'clients', user.uid) : null

  useEffect(()=>{
    if(user) {
      getDoc(docRef).then(doc=>{
        if(doc.data()){
          setSignInDetails(doc.data())
        }
      })
    }
  }, [user])
  
  const updateInfo = async()=>{

      try{
        
          updateDoc(docRef, signInDetails).then(()=>{
            console.log('updated')
          })
          
        
      } catch(err){
        console.log(err)
      }
  }
    

  console.log(signInDetails)

  return (
        <>
          {
            user && user.role === 'user' ? <Box py={4}>
            <Box mb={8}>
              <Typography variant='h5' gutterBottom>Welcome Back </Typography>
              <Typography variant='body-small' gutterBottom>Today is a new day. Complete your registration and we'll be at your door step to collect your refuse.</Typography>
            </Box>
  
            
            <Stack spacing={4}>
              <Stack direction={'row'} spacing={2}>
                <FormGroup sx={{width: '50%'}}>
                  <TextField label='Email' name='email' required type='email' value={signInDetails.email} fullWidth onChange={(e)=>{
                    valueChange(e.target.name, e.target.value)
                  }}/>
                </FormGroup>
                <FormGroup sx={{width: '50%'}}>
                  <TextField label='Name' name='name' required fullWidth value={signInDetails.name} onChange={(e)=>{
                    valueChange(e.target.name, e.target.value)
                  }}/>
                </FormGroup>
              </Stack>
  
  
              <Stack direction={'row'} spacing={2}>
                 
                <FormGroup sx={{width: '50%'}}>
                  <TextField label='Pick Up Day' name='day' required select value={signInDetails.day} fullWidth onChange={(e)=>{
                    valueChange('day', e.target.value)
                  }}>
                    {
                      days.map((item, index)=>{
                        return <MenuItem value={item}>{item}</MenuItem>
                      })
                    }
                  </TextField>
                </FormGroup>

                <TimePicker name='time' renderInput={(params)=>{<TextField {...params}/>}} value={new Date(signInDetails.time * 1000)} onChange={(value)=>{
                  valueChange('time', new Date(value))
                  }} InputProps={{startAdornment: <LocationSearching/>}}/>
              </Stack>
  
              <FormGroup>
                  <TextField label='Phone' name='phone' required type='number' value={signInDetails.phone} fullWidth onChange={(e)=>{
                    valueChange(e.target.name, e.target.value)
                  }}/>
                </FormGroup>
  
  
              <FormGroup>
                  <TextField label='Link to Adress' value={signInDetails.address} name='address' required fullWidth onChange={(e)=>{
                    valueChange(e.target.name, e.target.value)
                  }} InputProps={{startAdornment: <LocationSearching/>}} />
                  <FormHelperText>Click <Link href='https://maps.google.com/' target='_blank'>HERE</Link> to search and copy the link to your address from google map </FormHelperText>
                </FormGroup>
                
  
              
  
              <Button variant='contained' color='primary' onClick={()=>{
                updateInfo()
              }}>Submit</Button>
  
              <Typography variant='body-small' sx={{textAlign: 'center'}}>Already have an account? <Link>Sign In</Link></Typography>
            </Stack>
  
            
  
            
          </Box> : <NotPermited/>
          }
        </>
  );
}


export default React.memo(UserForm)
