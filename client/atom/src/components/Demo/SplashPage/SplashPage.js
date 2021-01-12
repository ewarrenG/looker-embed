import _ from 'lodash'
import React, { useState, useEffect, useContext } from 'react';
import { Box, Grid, CircularProgress, Card } from '@material-ui/core'
import CodeFlyout from '../CodeFlyout';
import rawSampleCode from '!!raw-loader!./SplashPage.js'; // eslint-disable-line import/no-webpack-loader-syntax
import useStyles from './styles.js';
import { SingleValueVis } from './SingleValueVis';
import { Welcome } from './Welcome';
import { PopularAnalysis } from './PopularAnalysis';
import AppContext from '../../../contexts/AppContext';
import { EmbeddedQuery } from './EmbeddedQuery';
const { validIdHelper } = require('../../../tools');

//start of SplashPage Component
export default function SplashPage(props) {
  console.log('SplashPage')
  //intialize state using hooks

  const topBarBottomBarHeight = 112;
  const [value, setValue] = useState(0);
  const [iFrameExists, setIFrame] = useState(1);
  const [clientSideCode, setClientSideCode] = useState('');
  const [serverSideCode, setServerSideCode] = useState('');
  const [height, setHeight] = useState((window.innerHeight - topBarBottomBarHeight));

  const { clientSession, highlightShow, codeShow } = useContext(AppContext)
  const { userProfile, lookerUser, lookerHost } = clientSession



  //declare constants
  const classes = useStyles();
  const { staticContent, staticContent: { lookerContent }, staticContent: { type },
    handleTabChange,
  } = props;
  const codeTab = {
    type: 'code flyout', label: 'Code', id: 'codeFlyout',
    lookerContent, lookerUser, clientSideCode, serverSideCode
  }
  const demoComponentType = type || 'code flyout';

  //handle tab change
  const handleChange = (event, newValue) => {
    handleTabChange(0);
    setValue(newValue);
  };

  /**
   * listen for lookerContent and call 
   * setSampleCode
  */
  useEffect(() => {
    window.addEventListener("resize", () => setHeight((window.innerHeight - topBarBottomBarHeight)));
  }, [lookerContent]);

  /**
   * What this return  does:
   * Rendering of actual html elements,
   * this section is necessary but less relevant to looker functionality itself
   */

  // console.log({ staticContent })
  // console.log({ lookerContent })
  return (
    <div className={`${classes.root} demoComponent`}
      style={{ height }}>
      <Card elevation={1} className={`${classes.padding30} 
      ${classes.height100Percent}
      ${classes.overflowScroll}`}
      >
        <Grid container
          key={validIdHelper(type)}>
          <div className={classes.root}>
            {iFrameExists ? '' :
              <Grid item sm={12} >
                <Card className={`${classes.card} ${classes.flexCentered}`}>
                  <CircularProgress className={classes.circularProgress} />
                </Card>
              </Grid>
            }
            <Box className={iFrameExists ? `` : `${classes.hidden}`}>
              <Grid container
                spacing={3}
                key={`${validIdHelper(demoComponentType + '-outerFragment')}`}
                className={`${classes.noContainerScroll}`}
              >
                {
                  codeShow ? <Grid item sm={6}
                    className={`${classes.positionFixedTopRight}`}
                  >
                    <CodeFlyout {...props}
                      classes={classes}
                      lookerUser={lookerUser}
                      height={height}
                    />
                  </Grid> : ''}
                {lookerContent.map((lookerContent, innerIndex) => {
                  return (
                    <Grid
                      key={`${validIdHelper(demoComponentType + '-innerFragment-' + innerIndex)}`}
                      item
                      sm={parseInt(lookerContent.gridWidth)}
                    >
                      {(lookerContent.type === 'welcome') && <Welcome
                        {...{ lookerContent, classes, demoComponentType, lookerHost }}
                      />}
                      {(lookerContent.type === 'single value') && <SingleValueVis
                        {...{ lookerContent, classes, demoComponentType, lookerHost }}
                      />}
                      {(lookerContent.type === 'dashboard') && <EmbeddedQuery
                        {...{ lookerContent, classes, lookerHost }} id={validIdHelper(`embedContainer-${demoComponentType}-${lookerContent.id}`)}
                      />}
                      {(lookerContent.type === 'popular analysis') && <PopularAnalysis
                        {...{ lookerContent, classes, demoComponentType, lookerHost }}
                      />}
                    </Grid>
                  )
                })}
              </Grid>
            </Box >
          </div >
        </Grid >
      </Card >
    </div >
  )
}