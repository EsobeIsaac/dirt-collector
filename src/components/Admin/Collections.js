import React, { useEffect, useState }  from 'react';
import {AppBar, Avatar, Box, Button, Chip, Container, Divider, Drawer, Grid, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemSecondaryAction, ListItemText, Stack, Toolbar, Typography, Paper, AvatarGroup, SpeedDial, SpeedDialIcon, SpeedDialAction, Menu, MenuItem, FormGroup, TextField, Link, ToggleButtonGroup, ToggleButton} from '@mui/material';

import Delete from '@mui/icons-material/Delete';
import picture from '../../utils/images/esobeisaac.jpg';
import CalendarMonth from '@mui/icons-material/CalendarMonth';
import Email from '@mui/icons-material/Email';
import Call from '@mui/icons-material/Call';
import Directions from '@mui/icons-material/Directions';
import MoreVert from '@mui/icons-material/MoreVert';
import {getDocs, onSnapshot, query, where} from 'firebase/firestore'
import NotPermited from '../NotPermited';


function Collection({colRef, user, noUser}) { 
  
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  
  const [clients, setClients] = useState([]);
  
  const [filterMode, setFilterMode] = useState('all')
    useEffect(()=>{
      if(filterMode === 'all') {
        getDocs(colRef).then(snapshot=>{
          let document = [];

          snapshot.docs.forEach((doc)=>{
            document.push(doc.data())
          })
                
          setClients(prevState=>([
            ...document
          ])); 
        })
      }
      if(filterMode === 'today') {


        days.forEach((day,index)=>{
            // Check if the index of day value is equal to the returned value of getDay()
            if(index === new Date().getDay()){
              console.log(day)
                const q = query(colRef, where('day', '==', day));
                onSnapshot(q, snapshot=>{
                  let document = [];
                  snapshot.docs.forEach((doc)=>{
                    console.log(doc.data())
                    document.push(doc.data())
                  })
                  setClients(prevState=>([
                    ...document
                  ])); 
                })
            }
          }
        )
      }

      if(filterMode === 'week') {


        days.forEach((day,index)=>{
            // Check if the index of day value is equal to the returned value of getDay()
            if(index === new Date().getDay()){
              console.log(day)
              setClients([])
              for(let i = index; i < days.length; i++) {
                const q = query(colRef, where('day', '==', days[i]));
                onSnapshot(q, snapshot=>{
                  let document = [];
                  snapshot.docs.forEach((doc)=>{
                    document.push(doc.data())
                  })
                  setClients(prevState=>([
                    ...prevState,
                    ...document
                  ])); 
                })
              }
                
            }
          }
        )
      }
    }, [filterMode])

  
    const [transMenuAnchorEl, setTransMenuAnchorEl] = useState(null);
    const [userInfo, setUserInfo] = useState('')

  return ( 

      <>
        {
          user && user.role === 'admin' ? <Box>
          <Typography variant='h6'>Collections</Typography>
  
          <Stack direction={'row'} justifyContent={'center'} mt={8}>
              <ToggleButtonGroup exclusive value={filterMode} onChange={(e, updatedFormats)=>{
                  setFilterMode(updatedFormats)
              }}  >
                  <ToggleButton value={'all'}>All Collection</ToggleButton>
                  <ToggleButton value={'today'}>Todays Collection</ToggleButton>
                  <ToggleButton value={'week'}>This Week Collection</ToggleButton>
              </ToggleButtonGroup>
          </Stack>
  
         
          <List>
            {
              !clients[0] ? <Typography variant='h4'> No Item</Typography> : (
                clients.map((item)=>{
                  
                  let hour = null;
                  let minute = null;
                  if(item.time) {
                    let time = new Date(item.time.seconds * 1000);
                    hour = time.getHours();
                    minute = time.getMinutes();
                  }
                  return <Box>
                    {
                    item.role === 'admin' ? null : (
                      <>
                    <ListItem>
                      {/* <ListItemIcon>
                          <Avatar src={picture}/>
                      </ListItemIcon> */}
                        <Menu anchorEl={transMenuAnchorEl} open={Boolean(transMenuAnchorEl && userInfo === item.user)} anchorOrigin={{
                          vertical: 'middle',
                          horizontal: 'left'
                        }} transformOrigin={{
                          vertical: 'middle',
                          horizontal: 'right'
                        }} onClose={()=>{
                          setTransMenuAnchorEl(null)
                          setUserInfo(null)
                        }}>
                    
                          <MenuItem>
                            <Button href={`mailto:${item.email}`}><Email/> Email</Button>
                          </MenuItem>
                          <MenuItem>
                              <Button href={`tel:${item.phone}`}><Call/> Call</Button>
                          </MenuItem>
                          <MenuItem>
                            <Button href={`${item.address}`} target='_black'><Directions/> Directions</Button>
                          </MenuItem> 
                          <MenuItem>
                            <Button><Delete/> Delete</Button>
                          </MenuItem>
                        
                        </Menu>
  
                      <ListItemText primary={item.name && item.name} secondary={<Typography sx={{display: 'flex', alignItems: 'center', color: '#333'}} variant='body-small'><CalendarMonth/> {item.day && item.day} {
                        item.time ? ` - ${hour <= 9 ? "0"+hour : hour}:${minute <= 9 ? "0"+minute :minute}` : null
                      }</Typography>} />
                      <ListItemSecondaryAction>
                          <IconButton onClick={(e)=>{
                            setTransMenuAnchorEl(e.currentTarget)
                            setUserInfo(item.user)
                          }}><MoreVert/></IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider />
                  </>
                    )
                  }
                  </Box>
                })
              )
            }
            
  
          </List>
        </Box> : <NotPermited/>
        }
      </>   

  );
}




export default Collection
