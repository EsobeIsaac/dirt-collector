import React, {useState }  from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,  FormGroup,  Stack, TextField,  Typography} from '@mui/material';


import {EmailAuthProvider, createUserWithEmailAndPassword, deleteUser, getAuth, reauthenticateWithCredential, signInWithEmailAndPassword} from 'firebase/auth'


import {initializeApp} from 'firebase/app'
import { doc, setDoc } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyAr0raItIMkD-vzG9HcM0sqZJNFehg5rgY",
  authDomain: "devfest-eket-hackathon.firebaseapp.com",
  projectId: "devfest-eket-hackathon",
  storageBucket: "devfest-eket-hackathon.appspot.com",
  messagingSenderId: "451278627478",
  appId: "1:451278627478:web:bfb216c90de8d1940498b7"
};

initializeApp(firebaseConfig)


const auth = getAuth();

function Sign({reauthenticating, user, db, cancelFunc}) {

  const [signState, setSignState] = useState(reauthenticating ? 'reauthenticating' : 'login')
  const [message, setMessage] = useState(null)

  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    displayName: '',
    phoneNumber: '',
  })

  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  const sign = () => {
    if(signState === 'reauthenticating') {
      reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, credentials.password)).then((value)=>{
        deleteUser(auth.currentUser).then(()=>{
          window.location.pathname = '/'
        }).catch(err=>{
          setMessage(err.code)
        })
      }).catch((err)=>{
        setMessage(err.code)
      })
    }

    if(signState === 'login') {
      signInWithEmailAndPassword(auth, credentials.email, credentials.password).then((user)=>{
        window.location.pathname = '/'
      }).catch((err)=>{
        setMessage(err.code)
      })
    }

    if(signState === 'signup') {
      createUserWithEmailAndPassword(auth, credentials.email, credentials.password)
      .then(user=>{
        setDoc(doc(db, 'clients', user.user.uid), {
          email: credentials.email,
          phone: credentials.phoneNumber,
          name: credentials.displayName,
          address: '',
          day: days[new Date().getDay()],
          time: new Date(),
          user: user.user.uid,
          role: 'user'
        }).then(()=>{
          window.location.pathname = '/'
        })
      }).catch(err=>{
        setMessage(err.code)
      })
    }
    
  }

  
    
  return (

          <Dialog open={true}>
            
          <DialogTitle>{signState === 'login' ? 'Sign In' : signState === 'reauthenticating' ? 'Input Password To Continue' : 'Sign Up'}</DialogTitle>
          <DialogContent>
            <Stack spacing={2}>
            {
              signState === 'signup' && <Stack direction={'row'} spacing={2}>
                <FormGroup sx={{width: '50%'}}>
                  <TextField label='Phone' name='phone' required type='number' fullWidth onChange={(e)=>{
                    setCredentials((prevState)=>({
                      ...prevState,
                      phoneNumber: e.target.value
                    }))
                  }}/>
                </FormGroup>
                <FormGroup sx={{width: '50%'}}>
                  <TextField label='Name' name='name' required fullWidth onChange={(e)=>{
                    setCredentials((prevState)=>({
                      ...prevState,
                      displayName: e.target.value,
                    }))
                  }}/>
                </FormGroup>
              </Stack>
            }
              {
                signState === 'reauthenticating' ? null : <TextField label='Email' name='email' required type='email' fullWidth onChange={(e)=>{
                  setCredentials((prevState)=>({
                    ...prevState,
                    email: e.target.value
                  }))
                }} value={credentials.email}/>
              }

              <TextField label='Password' name='password' type='password' required fullWidth onChange={(e)=>{
                setCredentials((prevState)=>({
                  ...prevState,
                  password: e.target.value
                }))
              }} value={credentials.password}/>
            </Stack>
            <Box>
              {
                signState === 'reauthenticating' && <Typography mt={4}>Something went wrong, input your password to continue</Typography>
              }
              {
                signState === 'signup' && <Typography mt={4}>Already have an account? <Button variant='text' onClick={()=>{
                  setSignState('login')
                }}>Login</Button> instead</Typography>
              }
              {
                signState === 'login' && <Typography mt={4}>Do not have an account? <Button variant='text' onClick={()=>{
                  setSignState('signup')
                }}>Signup</Button> instead</Typography>
              }
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={()=>{
              sign()
            }}>Submit</Button>
            <Button onClick={()=>{
              cancelFunc();
            }}>Cancel</Button>
          </DialogActions>
          <Typography color={'error'}>{message}</Typography>
        </Dialog>
      
      
  );
}


export default Sign
