import _ from 'lodash'
import React, { useContext } from 'react';
import { useHistory } from "react-router-dom";
import { GoogleLogin } from 'react-google-login';
import AppContext from '../../contexts/AppContext';
import { writeNewSession } from '../../AuthUtils/auth';
import UsecaseContent from '../../usecaseContent.json';
import InitialLookerUser from '../../initialLookerUser.json';
import useStyles from './styles.js';
import '../Home.css';
import { Grid, Card, CardActions, CardContent, Typography } from '@material-ui/core'
const { validIdHelper, usecaseHelper } = require('../../tools');

export default function SignIn(props) {
  // console.log('SignIn');
  // console.log('props', props)

  let history = useHistory();
  let { clientSession, setClientSession } = useContext(AppContext)

  const responseGoogle = (response) => {
    if (response.error) {
      console.log('response.error', response.error)
    } else {
      setClientSession((clientSession) => { return { ...clientSession, userProfile: response.profileObj, lookerUser: InitialLookerUser } })
      writeNewSession({ ...clientSession, userProfile: response.profileObj, lookerUser: InitialLookerUser })
      history.push('/analytics');
    }
  }
  const googleClientId = `${process.env.REACT_APP_GOOGLE_CLIENT_ID}.apps.googleusercontent.com`
  const usecaseFromUrl = usecaseHelper(UsecaseContent);

  const classes = useStyles();
  const backgroundImageInt = Math.floor(Math.random() * 4) + 1;
  const backgroundImage = require(`../../images/${usecaseFromUrl}_background${backgroundImageInt}.jpg`);
  const logoImage = require(`../../images/${usecaseFromUrl}_logo_black.svg`)

  return (
    <div className={`${classes.root} demoComponent ${classes.h100}`}>
      <Grid container
        key={validIdHelper('sign in page')}
        className={`${classes.h100}`}>
        <Grid item sm={12} className={'sign-in-background-img'}
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover'
          }}
        >
          <Card className={classes.card}>
            <div className={classes.cardCopy}>
              <img
                src={logoImage}
              />
              <CardContent >
                <Typography variant="h5" component="h2">
                  Welcome
                            </Typography>
                <Typography variant="body2" component="p">
                  Please sign in to access <br /> your merchant portal
                            </Typography>
              </CardContent>
              <CardActions className={`${classes.actions}`} >
                <GoogleLogin
                  clientId={googleClientId}
                  buttonText="Login"
                  onSuccess={responseGoogle}
                  onFailure={responseGoogle}
                  cookiePolicy={'single_host_origin'}
                // redirectUri={'/analytics/:democomponent'}
                />
              </CardActions>
            </div>
          </Card>
        </Grid>
      </Grid>
    </div >
  )
}