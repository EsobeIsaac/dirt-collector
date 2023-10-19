import React, {useEffect, useState }  from 'react';
import {AppBar, Avatar, Box, Button, Container, Divider, Drawer, IconButton, Stack, Toolbar, Typography, createTheme, ThemeProvider} from '@mui/material';
import './App.css';
import {LocalizationProvider} from '@mui/x-date-pickers'
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns'

import IconMenu from '@mui/icons-material/Menu';
import Logout from '@mui/icons-material/Logout';
import LogIn from '@mui/icons-material/Login';
import Dashboard from '@mui/icons-material/Dashboard';
import RecyclingSharp from '@mui/icons-material/FireTruck';

import picture from './utils/images/user.png';
import Sign from './components/SignLog';
import UserForm from './components/UserForm';
import Collection from './components/Admin/Collections';

import { getAuth, onAuthStateChanged, signOut} from 'firebase/auth'
import {Link, Route, Routes, useNavigate} from 'react-router-dom'

import {collection, doc, getDoc, getFirestore} from 'firebase/firestore'


import {initializeApp} from 'firebase/app'
import Delete from '@mui/icons-material/Delete';
import Home from './components/Home';
import logo from './utils/brand/LOGO.jpg';


const firebaseConfig = {
  apiKey: "AIzaSyAr0raItIMkD-vzG9HcM0sqZJNFehg5rgY",
  authDomain: "devfest-eket-hackathon.firebaseapp.com",
  projectId: "devfest-eket-hackathon",
  storageBucket: "devfest-eket-hackathon.appspot.com",
  messagingSenderId: "451278627478",
  appId: "1:451278627478:web:bfb216c90de8d1940498b7"
};
const db = getFirestore();

initializeApp(firebaseConfig)


const auth = getAuth();

const colRef = collection(db, 'clients');

const theme = createTheme({
  palette: {
    secondary:{
      main: '#00e676'
    },
    primary:{
      main: '#00695f'
    }
  }
})

function App({sign}) {
  
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  
  const [reauthenticating, setReauthenticating] = useState(false)
  
  
  useEffect(()=>{
    onAuthStateChanged(auth, (me)=>{
      if(me) {
        const docRef = doc(db, 'clients', me.uid)
        getDoc(docRef).then(doc=>{
          if(doc.data()){
            setUser({...doc.data(), uid: me.uid});
            console.log(user, me)
          }
        }).catch(err=>{
          console.log(err.code)
        })
      }
    })
  }, [ ])

  useEffect(()=>{
    if(window.location.pathname !== '/') {
      setLogs(Boolean(!user))
    }
    console.log(user, Boolean(user))
  }, [user])
  
  

  

  const [windowSize, setWindowSize] = useState(window.innerWidth);
  
  const [menuDrawer, setMenuDrawer] = useState(windowSize >= 960 ? true : false);


  window.onresize = () =>{
    setWindowSize(window.innerWidth)
  }



  const deleteAccount = () => { 
      setReauthenticating(true)
  }

  const [logs, setLogs] = useState(false)

    

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <div className='App'>
          <AppBar sx={(menuDrawer && windowSize >= 960) ? {
          width: 'calc(100% - 280px)',
          marginLeft: '280px',
          backgroundColor: '#fff',
        } : {backgroundColor: '#fff', zIndex: 1500}}>
          <Toolbar>
            <IconButton onClick={()=>{
              setMenuDrawer((prevState)=>!prevState);
            }}><IconMenu/></IconButton>
            <Box sx={{
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center'
            }}>
            <img src={logo} alt='logo' style={{width: '100px'}}/>
            </Box>
            
            {
              user && <Avatar src={picture} alt='user' aria-label='user icon' sx={{
                marginRight: '0rem'
              }}/>
            }
            
            {
              user ? <IconButton sx={{
                marginRight: '1rem'
              }} onClick={()=>{
                signOut(auth).then(()=>{
                  console.log('logged out')
                  window.location.reload()
                })
              }}><Logout/></IconButton> : <Button endIcon={<LogIn/>} variant='text' sx={{
                marginRight: '1rem'
              }} onClick={()=>{
                setLogs(true)
              }}>Log In</Button>
            }
          </Toolbar>
        </AppBar>

        <Drawer anchor='left' variant={windowSize >= 960 ? 'persistent' : 'temporary'} open={menuDrawer} onClose={()=>{
          setMenuDrawer(false)
        }}>

          <Box  sx={{
            margin: '50px 0px',
            width: '280px'
          }} role='presentation'>
            <Stack spacing={4} textAlign={'center'}>
              {
                user ? <Link to={'/profile'}>
                <Button sx={{marginTop: '40px'}} variant='text' startIcon={<Avatar src={picture} alt='user'/>}>{user.name}</Button>
              </Link> : <Button variant='outline' endIcon={<LogIn/>} onClick={()=>{
                setLogs(true)
              }}>Log In</Button>
              }
              <Divider />
              <Link to={'/'}>
                <Button variant='text' startIcon={<Dashboard/>}>Home</Button>
              </Link>

              {
                user ? (
                  <>
                    {
                      user.role === 'user' && <Link to={'/profile'}>
                      <Button variant='text' startIcon={<Dashboard/>}>Profile</Button>
                    </Link>
                    }
                    
                    {
                      user.role === 'admin' && <Link to={'/collections'}>
                      <Button variant='text' startIcon={<Dashboard/>}>Collections</Button>
                    </Link>
                    }

                    {
                      user.role === 'user'&& 
                        <Button variant='text' startIcon={<Delete/>} onClick={()=>{
                          deleteAccount()
                        }}>Delete Account</Button>
                    }
                  </>
                ) : null
              }
              
              
              
            </Stack>
          </Box>

        </Drawer>

        
        <Box pt={13} sx={ windowSize >= 960 ? {
          width: menuDrawer ? 'calc(100% - 280px)' : '100%',
          marginLeft: menuDrawer ? '280px' : '0px',
          position: 'relative'
        } : {}}>
        <Container>


          <Routes>

            <Route element={<Home user={user} startedFunc = {()=>{
            
            setLogs(true);
          
        }}/>} path='/' exact/>
            <Route element={<UserForm colRef={colRef} user={user} db={db}/>} path='/profile'/>
            <Route element={<Collection colRef={colRef} user={user} />} path='/collections'/>
            <Route element={<Collection/>} path='/support'/>

          </Routes>

        {
          logs || reauthenticating ? (
          <Sign reauthenticating={reauthenticating} user={auth.currentUser} db={db} cancelFunc = {()=>{
            
              setLogs(false);
              navigate('/', {replace: true})
            
          }}/>
          ) : null
        }
          

        </Container>
      </Box>

        

        


      



        </div>
      </LocalizationProvider>
    </ThemeProvider>
  );
}


export default App
