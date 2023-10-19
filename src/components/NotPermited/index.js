import React, { useEffect, useState }  from 'react';
import axios from 'axios';
import {Box, Button, Stack, Typography, Paper, FormGroup, TextField, Link, FormHelperText, MenuItem} from '@mui/material';
import LocationSearching from '@mui/icons-material/LocationSearching';
import { DateTimePicker } from '@mui/x-date-pickers';
import {addDoc, doc, getDoc, setDoc, updateDoc} from 'firebase/firestore'




function UserForm({db, userID, colRef}) {



  return (
        <Box p={4}>
                
            <Typography variant='h4'>You are not permitted to access this route</Typography>
          
        </Box>
  );
}


export default React.memo(UserForm)
